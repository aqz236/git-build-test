#!/bin/bash

# GitHub仓库清理脚本
# 用于一键删除所有releases和tags

# 注意：移除 set -e 以支持并发处理和错误恢复

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 获取仓库信息
REPO_OWNER=$(gh repo view --json owner --jq .owner.login)
REPO_NAME=$(gh repo view --json name --jq .name)
REPO_FULL="${REPO_OWNER}/${REPO_NAME}"

echo -e "${BLUE}🗂️  当前仓库: ${REPO_FULL}${NC}"
echo

# 函数：删除所有releases (批量异步)
cleanup_releases() {
    echo -e "${YELLOW}🔍 查找所有releases...${NC}"
    
    # 获取所有release的tag名
    RELEASES=$(gh release list --limit 1000 --json tagName --jq '.[].tagName')
    
    if [[ -z "$RELEASES" ]]; then
        echo -e "${GREEN}✅ 没有找到任何releases${NC}"
        return
    fi
    
    RELEASE_COUNT=$(echo "$RELEASES" | wc -l | tr -d ' ')
    echo -e "${YELLOW}📋 找到 ${RELEASE_COUNT} 个releases${NC}"
    echo -e "${BLUE}前5个releases示例:${NC}"
    echo "$RELEASES" | head -5
    if [[ $RELEASE_COUNT -gt 5 ]]; then
        echo "..."
    fi
    echo
    
    read -p "$(echo -e ${RED}⚠️  确定要删除所有 ${RELEASE_COUNT} 个releases吗？输入 'yes' 确认: ${NC})" confirm
    
    if [[ "$confirm" != "yes" ]]; then
        echo -e "${YELLOW}❌ 操作已取消${NC}"
        return
    fi
    
    echo -e "${YELLOW}🗑️  开始批量异步删除releases...${NC}"
    echo -e "${BLUE}💡 使用并发处理，最大并发数: 10${NC}"
    
    # 创建临时目录存储任务状态
    TEMP_DIR=$(mktemp -d)
    CONCURRENT_LIMIT=10
    RUNNING_JOBS=0
    TOTAL_JOBS=0
    COMPLETED_JOBS=0
    FAILED_JOBS=0
    
    # 删除单个release的函数
    delete_single_release() {
        local tag="$1"
        local job_id="$2"
        local temp_dir="$3"
        
        if gh release delete "$tag" --yes --cleanup-tag 2>"${temp_dir}/error_${job_id}.log"; then
            echo "SUCCESS:$tag" > "${temp_dir}/result_${job_id}.txt"
        else
            echo "FAILED:$tag" > "${temp_dir}/result_${job_id}.txt"
        fi
    }
    
    # 导出函数以便子进程使用
    export -f delete_single_release
    
    echo "$RELEASES" | while IFS= read -r tag; do
        if [[ -n "$tag" ]]; then
            # 等待直到有可用的并发槽位
            while [[ $RUNNING_JOBS -ge $CONCURRENT_LIMIT ]]; do
                sleep 0.1
                # 检查完成的任务
                for result_file in "${TEMP_DIR}"/result_*.txt; do
                    if [[ -f "$result_file" ]]; then
                        result=$(cat "$result_file")
                        job_file=$(basename "$result_file")
                        job_id=${job_file#result_}
                        job_id=${job_id%.txt}
                        
                        if [[ "$result" == SUCCESS:* ]]; then
                            COMPLETED_JOBS=$((COMPLETED_JOBS + 1))
                            release_tag=${result#SUCCESS:}
                            echo -e "${GREEN}✅ [$COMPLETED_JOBS/$RELEASE_COUNT] 已删除: ${release_tag}${NC}"
                        else
                            FAILED_JOBS=$((FAILED_JOBS + 1))
                            release_tag=${result#FAILED:}
                            echo -e "${RED}❌ [$FAILED_JOBS] 删除失败: ${release_tag}${NC}"
                        fi
                        
                        rm -f "$result_file" "${TEMP_DIR}/error_${job_id}.log" 2>/dev/null
                        RUNNING_JOBS=$((RUNNING_JOBS - 1))
                    fi
                done
            done
            
            # 启动新的删除任务
            TOTAL_JOBS=$((TOTAL_JOBS + 1))
            delete_single_release "$tag" "$TOTAL_JOBS" "$TEMP_DIR" &
            RUNNING_JOBS=$((RUNNING_JOBS + 1))
            
            echo -e "${YELLOW}🚀 [$TOTAL_JOBS/$RELEASE_COUNT] 启动删除: ${tag}${NC}"
        fi
    done
    
    # 等待所有任务完成
    echo -e "${YELLOW}⏳ 等待所有删除任务完成...${NC}"
    wait
    
    # 处理剩余的结果
    for result_file in "${TEMP_DIR}"/result_*.txt; do
        if [[ -f "$result_file" ]]; then
            result=$(cat "$result_file")
            if [[ "$result" == SUCCESS:* ]]; then
                COMPLETED_JOBS=$((COMPLETED_JOBS + 1))
                release_tag=${result#SUCCESS:}
                echo -e "${GREEN}✅ [$COMPLETED_JOBS/$RELEASE_COUNT] 已删除: ${release_tag}${NC}"
            else
                FAILED_JOBS=$((FAILED_JOBS + 1))
                release_tag=${result#FAILED:}
                echo -e "${RED}❌ 删除失败: ${release_tag}${NC}"
            fi
        fi
    done
    
    # 清理临时目录
    rm -rf "$TEMP_DIR"
    
    echo
    echo -e "${GREEN}🎉 Release删除完成！${NC}"
    echo -e "${GREEN}✅ 成功删除: ${COMPLETED_JOBS}${NC}"
    if [[ $FAILED_JOBS -gt 0 ]]; then
        echo -e "${RED}❌ 删除失败: ${FAILED_JOBS}${NC}"
    fi
}

# 函数：删除所有tags (批量异步)
cleanup_tags() {
    echo -e "${YELLOW}🔍 查找所有tags...${NC}"
    
    # 获取所有本地和远程tags
    TAGS=$(git tag -l)
    
    if [[ -z "$TAGS" ]]; then
        echo -e "${GREEN}✅ 没有找到任何tags${NC}"
        return
    fi
    
    TAG_COUNT=$(echo "$TAGS" | wc -l | tr -d ' ')
    echo -e "${YELLOW}📋 找到 ${TAG_COUNT} 个tags${NC}"
    echo -e "${BLUE}前5个tags示例:${NC}"
    echo "$TAGS" | head -5
    if [[ $TAG_COUNT -gt 5 ]]; then
        echo "..."
    fi
    echo
    
    read -p "$(echo -e ${RED}⚠️  确定要删除所有 ${TAG_COUNT} 个tags吗？输入 'yes' 确认: ${NC})" confirm
    
    if [[ "$confirm" != "yes" ]]; then
        echo -e "${YELLOW}❌ 操作已取消${NC}"
        return
    fi
    
    echo -e "${YELLOW}🗑️  开始批量删除tags...${NC}"
    echo -e "${BLUE}💡 先删除远程tags，再删除本地tags${NC}"
    
    # 批量删除远程tags (使用git push一次性删除多个)
    echo -e "${YELLOW}🌐 批量删除远程tags...${NC}"
    
    # 将tags转换为数组，分批处理
    TAGS_ARRAY=()
    while IFS= read -r tag; do
        if [[ -n "$tag" ]]; then
            TAGS_ARRAY+=("$tag")
        fi
    done <<< "$TAGS"
    
    # 分批删除远程tags (每批20个)
    BATCH_SIZE=20
    BATCH_COUNT=0
    TOTAL_BATCHES=$(( (${#TAGS_ARRAY[@]} + BATCH_SIZE - 1) / BATCH_SIZE ))
    
    for ((i=0; i<${#TAGS_ARRAY[@]}; i+=BATCH_SIZE)); do
        BATCH_COUNT=$((BATCH_COUNT + 1))
        BATCH_TAGS=("${TAGS_ARRAY[@]:i:BATCH_SIZE}")
        
        echo -e "${YELLOW}🚀 删除远程tags批次 [$BATCH_COUNT/$TOTAL_BATCHES] (${#BATCH_TAGS[@]} 个tags)${NC}"
        
        # 构建git push命令参数
        PUSH_ARGS=("origin")
        for tag in "${BATCH_TAGS[@]}"; do
            PUSH_ARGS+=(":refs/tags/$tag")
        done
        
        if git push "${PUSH_ARGS[@]}" 2>/dev/null; then
            echo -e "${GREEN}✅ 批次 [$BATCH_COUNT/$TOTAL_BATCHES] 远程tags删除成功${NC}"
        else
            echo -e "${RED}⚠️  批次 [$BATCH_COUNT/$TOTAL_BATCHES] 部分远程tags可能已不存在${NC}"
        fi
    done
    
    # 批量删除本地tags
    echo -e "${YELLOW}💻 批量删除本地tags...${NC}"
    
    # 分批删除本地tags
    BATCH_COUNT=0
    for ((i=0; i<${#TAGS_ARRAY[@]}; i+=BATCH_SIZE)); do
        BATCH_COUNT=$((BATCH_COUNT + 1))
        BATCH_TAGS=("${TAGS_ARRAY[@]:i:BATCH_SIZE}")
        
        echo -e "${YELLOW}🚀 删除本地tags批次 [$BATCH_COUNT/$TOTAL_BATCHES] (${#BATCH_TAGS[@]} 个tags)${NC}"
        
        if git tag -d "${BATCH_TAGS[@]}" >/dev/null 2>&1; then
            echo -e "${GREEN}✅ 批次 [$BATCH_COUNT/$TOTAL_BATCHES] 本地tags删除成功${NC}"
        else
            echo -e "${RED}⚠️  批次 [$BATCH_COUNT/$TOTAL_BATCHES] 部分本地tags删除失败${NC}"
        fi
    done
    
    echo
    echo -e "${GREEN}🎉 所有tags删除完成！${NC}"
    echo -e "${GREEN}📊 处理了 ${TAG_COUNT} 个tags，共 ${TOTAL_BATCHES} 个批次${NC}"
}

# 函数：显示统计信息
show_stats() {
    echo -e "${BLUE}📊 当前仓库统计:${NC}"
    
    RELEASE_COUNT=$(gh release list --limit 1000 --json tagName --jq '. | length')
    TAG_COUNT=$(git tag -l | wc -l | tr -d ' ')
    
    echo -e "${BLUE}  Releases数量: ${RELEASE_COUNT}${NC}"
    echo -e "${BLUE}  Tags数量: ${TAG_COUNT}${NC}"
    echo
}

# 主菜单
main_menu() {
    while true; do
        echo -e "${BLUE}🛠️  GitHub仓库清理工具${NC}"
        echo -e "${BLUE}===================${NC}"
        echo
        show_stats
        echo -e "${YELLOW}请选择操作:${NC}"
        echo "1. 删除所有releases (批量异步)"
        echo "2. 删除所有tags (批量处理)"
        echo "3. 删除所有releases和tags (批量处理)"
        echo "4. 🚀 快速全部清理 (推荐)"
        echo "5. 显示统计信息"
        echo "6. 退出"
        echo
        
        read -p "请输入选择 (1-6): " choice
        
        case $choice in
            1)
                cleanup_releases
                echo
                ;;
            2)
                cleanup_tags
                echo
                ;;
            3)
                cleanup_releases
                echo
                cleanup_tags
                echo
                ;;
            4)
                echo -e "${BLUE}🚀 快速全部清理模式${NC}"
                echo -e "${YELLOW}此模式将同时删除所有releases和tags，使用最优化的批量处理${NC}"
                echo
                read -p "$(echo -e ${RED}⚠️  确定要清理所有内容吗？输入 'yes' 确认: ${NC})" confirm
                if [[ "$confirm" == "yes" ]]; then
                    cleanup_releases
                    echo
                    cleanup_tags
                else
                    echo -e "${YELLOW}❌ 快速清理已取消${NC}"
                fi
                echo
                ;;
            5)
                show_stats
                ;;
            6)
                echo -e "${GREEN}👋 再见！${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}❌ 无效选择，请重试${NC}"
                echo
                ;;
        esac
    done
}

# 检查必要工具
check_requirements() {
    if ! command -v gh &> /dev/null; then
        echo -e "${RED}❌ GitHub CLI (gh) 未安装${NC}"
        echo -e "${YELLOW}请先安装 GitHub CLI: https://cli.github.com/${NC}"
        echo -e "${YELLOW}或使用 Homebrew: brew install gh${NC}"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        echo -e "${RED}❌ Git 未安装${NC}"
        exit 1
    fi
    
    # 检查是否已登录GitHub CLI
    if ! gh auth status &> /dev/null; then
        echo -e "${RED}❌ GitHub CLI 未登录${NC}"
        echo -e "${YELLOW}请先运行: gh auth login${NC}"
        exit 1
    fi
    
    # 检查是否在git仓库中
    if ! git rev-parse --is-inside-work-tree &> /dev/null; then
        echo -e "${RED}❌ 当前目录不是git仓库${NC}"
        exit 1
    fi
}

# 主程序入口
echo -e "${GREEN}🚀 GitHub仓库清理脚本启动中...${NC}"
echo

# 检查环境
check_requirements

# 启动主菜单
main_menu
