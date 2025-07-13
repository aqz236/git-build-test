import {
  faAndroid,
  faApple,
  faLinux,
  faWindows,
} from "@fortawesome/free-brands-svg-icons";
import {
  faDownload,
  faFile,
  faFileArchive,
  faFileZipper,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";

interface Asset {
  id: number;
  name: string;
  browser_download_url: string;
  download_count: number;
  size: number;
}

interface AssetsModalProps {
  assets: Asset[];
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

// 平台图标映射
const getPlatformIcon = (filename: string) => {
  const name = filename.toLowerCase();

  if (name.includes("linux"))
    return { icon: faLinux, color: "text-orange-500" };
  if (name.includes("darwin") || name.includes("macos") || name.includes("mac"))
    return { icon: faApple, color: "text-gray-600" };
  if (
    name.includes("windows") ||
    name.includes("win32") ||
    name.includes("win64")
  )
    return { icon: faWindows, color: "text-blue-500" };
  if (name.includes("android"))
    return { icon: faAndroid, color: "text-green-500" };

  // 文件类型图标
  if (name.endsWith(".zip"))
    return { icon: faFileZipper, color: "text-yellow-500" };
  if (name.endsWith(".7z") || name.endsWith(".tar.gz") || name.endsWith(".tar"))
    return { icon: faFileArchive, color: "text-purple-500" };

  return { icon: faFile, color: "text-gray-400" };
};

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// 格式化下载次数
const formatDownloadCount = (count: number) => {
  if (count < 1000) return count.toString();
  if (count < 1000000) return (count / 1000).toFixed(1) + "K";
  return (count / 1000000).toFixed(1) + "M";
};

export function AssetsModal({
  assets,
  title,
  isOpen,
  onClose,
}: AssetsModalProps) {
  // ESC键关闭模态框
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // 防止背景滚动
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FontAwesomeIcon icon={faX} className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {assets.length === 0 ? (
            <div className="text-center py-8">
              <FontAwesomeIcon
                icon={faFile}
                className="w-12 h-12 text-gray-300 mb-4"
              />
              <p className="text-gray-500">无可用的构建产物</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {assets.map((asset) => {
                const { icon, color } = getPlatformIcon(asset.name);
                return (
                  <div
                    key={asset.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <FontAwesomeIcon
                        icon={icon}
                        className={`w-8 h-8 ${color}`}
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {asset.name}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{formatFileSize(asset.size)}</span>
                          <span>•</span>
                          <span>
                            {formatDownloadCount(asset.download_count)} 下载
                          </span>
                        </div>
                      </div>
                    </div>
                    <a
                      href={asset.browser_download_url}
                      download
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FontAwesomeIcon icon={faDownload} className="w-4 h-4" />
                      下载
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
