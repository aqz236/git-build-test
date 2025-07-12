/**
 * @typedef {Object} ReleaseData
 * @property {string} version - 版本号
 * @property {string} createdAt - 创建时间
 * @property {string} commitHash - 提交哈希
 * @property {string} privateBranch - 私有分支
 * @property {string} triggerEvent - 触发事件
 * @property {string} triggerRepo - 触发仓库
 * @property {string} triggerBranch - 触发分支
 * @property {string} triggerCommit - 触发提交
 * @property {string} triggerAuthor - 触发作者
 * @property {string} commitMessage - 提交消息
 * @property {string} changelog - 变更日志
 * @property {string} githubBaseUrl - GitHub基础URL
 * @property {string} repoPath - 仓库路径
 * @property {string} releaseHash - 发布哈希
 * @property {string} releaseHashShort - 发布哈希短版本
 * @property {DownloadFile[]} downloadFiles - 下载文件列表
 */

/**
 * @typedef {Object} DownloadFile
 * @property {string} name - 文件名
 * @property {number} size - 文件大小
 * @property {string} browser_download_url - 下载URL
 * @property {number} download_count - 下载次数
 * @property {string} content_type - 内容类型
 * @property {string} updated_at - 更新时间
 */

/**
 * @typedef {Object} BranchData
 * @property {string[]} commits - 提交列表
 */

/**
 * @typedef {Object} TabConfig
 * @property {string} id - 标签ID
 * @property {string} label - 标签标题
 * @property {string} icon - 图标类名
 */

/**
 * @typedef {Object} TechStack
 * @property {string} name - 技术名称
 * @property {string} icon - 图标类名
 * @property {string} color - 颜色类名
 */
