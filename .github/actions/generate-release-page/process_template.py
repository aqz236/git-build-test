#!/usr/bin/env python3
import os
import sys

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
        '{{COMMIT_MESSAGE}}': os.environ.get('REPLACE_COMMIT_MESSAGE', ''),
        '{{GITHUB_BASE_URL}}': os.environ.get('REPLACE_GITHUB_BASE_URL', ''),
        '{{REPO_PATH}}': os.environ.get('REPLACE_REPO_PATH', ''),
        '{{DOWNLOAD_FILES}}': os.environ.get('REPLACE_DOWNLOAD_FILES', '[]'),
        '{{CHANGELOG}}': '查看完整 changelog'
    }
    
    # 执行替换
    for placeholder, value in replacements.items():
        content = content.replace(placeholder, str(value))
    
    # 写回文件
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Template processing completed successfully")

if __name__ == "__main__":
    main()
