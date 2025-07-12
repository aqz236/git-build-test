#!/usr/bin/env python3
import os
import sys
import json

def escape_for_js(text):
    """转义文本以便安全地嵌入到 JavaScript 字符串中"""
    if not text:
        return ''
    # 转义反斜杠和引号
    text = text.replace('\\', '\\\\')
    text = text.replace('`', '\\`')
    text = text.replace('${', '\\${')
    return text

def main():
    if len(sys.argv) != 2:
        print("Usage: python3 process_template.py <release_dir>")
        sys.exit(1)
    
    release_dir = sys.argv[1]
    file_path = f"{release_dir}/index.html"
    
    # 读取文件
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 从环境变量获取替换值
    changelog_file = os.environ.get('REPLACE_CHANGELOG_FILE')
    if changelog_file and os.path.exists(changelog_file):
        with open(changelog_file, 'r', encoding='utf-8') as f:
            changelog = escape_for_js(f.read())
    else:
        changelog = escape_for_js(os.environ.get('REPLACE_CHANGELOG', ''))
    
    download_files = os.environ.get('REPLACE_DOWNLOAD_FILES', '[]')
    
    # 验证 download_files 是有效的 JSON，并进行安全转义
    try:
        # 先解析 JSON 确保有效性
        parsed_files = json.loads(download_files)
        # 重新序列化，并转义双引号和反斜杠
        download_files_safe = json.dumps(parsed_files).replace('\\', '\\\\').replace('"', '\\"')
    except json.JSONDecodeError:
        print(f"Warning: Invalid JSON in DOWNLOAD_FILES: {download_files}")
        download_files_safe = '[]'
    
    replacements = {
        '{{VERSION}}': os.environ.get('REPLACE_VERSION', ''),
        '{{CREATED_AT}}': os.environ.get('REPLACE_CREATED_AT', ''),
        '{{COMMIT_HASH}}': os.environ.get('REPLACE_COMMIT_HASH', ''),
        '{{PRIVATE_BRANCH}}': os.environ.get('REPLACE_PRIVATE_BRANCH', ''),
        '{{TRIGGER_EVENT}}': os.environ.get('REPLACE_TRIGGER_EVENT', ''),
        '{{TRIGGER_REPO}}': os.environ.get('REPLACE_TRIGGER_REPO', ''),
        '{{TRIGGER_BRANCH}}': os.environ.get('REPLACE_TRIGGER_BRANCH', ''),
        '{{TRIGGER_COMMIT}}': os.environ.get('REPLACE_TRIGGER_COMMIT', ''),
        '{{TRIGGER_AUTHOR}}': os.environ.get('REPLACE_TRIGGER_AUTHOR', ''),
        '{{COMMIT_MESSAGE}}': escape_for_js(os.environ.get('REPLACE_COMMIT_MESSAGE', '')),
        '{{GITHUB_BASE_URL}}': os.environ.get('REPLACE_GITHUB_BASE_URL', ''),
        '{{REPO_PATH}}': os.environ.get('REPLACE_REPO_PATH', ''),
        '{{DOWNLOAD_FILES}}': download_files_safe,
        '{{CHANGELOG}}': changelog
    }
    
    # 执行替换
    for placeholder, value in replacements.items():
        content = content.replace(placeholder, str(value))
    
    # 写回文件
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Template processing completed successfully")
    print(f"Processed changelog length: {len(changelog)}")
    print(f"Download files: {download_files}")

if __name__ == "__main__":
    main()
