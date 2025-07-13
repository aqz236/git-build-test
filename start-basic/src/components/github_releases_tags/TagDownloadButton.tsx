import { faDownload, faFileArchive } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

interface TagDownloadsModalProps {
  tagName: string;
  zipballUrl: string;
  tarballUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

function TagDownloadsModal({
  tagName,
  zipballUrl,
  tarballUrl,
  isOpen,
  onClose,
}: TagDownloadsModalProps) {
  // ESC键关闭模态框
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // 防止背景滚动
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            下载 {tagName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            <a
              href={zipballUrl}
              download
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FontAwesomeIcon
                icon={faFileArchive}
                className="w-6 h-6 text-yellow-500"
              />
              <div>
                <div className="font-medium">ZIP 格式</div>
                <div className="text-sm text-gray-500">源代码压缩包</div>
              </div>
              <FontAwesomeIcon
                icon={faDownload}
                className="w-4 h-4 text-blue-600 ml-auto"
              />
            </a>

            <a
              href={tarballUrl}
              download
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FontAwesomeIcon
                icon={faFileArchive}
                className="w-6 h-6 text-purple-500"
              />
              <div>
                <div className="font-medium">TAR 格式</div>
                <div className="text-sm text-gray-500">源代码压缩包</div>
              </div>
              <FontAwesomeIcon
                icon={faDownload}
                className="w-4 h-4 text-blue-600 ml-auto"
              />
            </a>
          </div>
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

interface TagDownloadButtonProps {
  tagName: string;
  zipballUrl: string;
  tarballUrl: string;
}

export function TagDownloadButton({
  tagName,
  zipballUrl,
  tarballUrl,
}: TagDownloadButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <FontAwesomeIcon icon={faDownload} className="w-3 h-3" />
        下载源码
      </button>

      <TagDownloadsModal
        tagName={tagName}
        zipballUrl={zipballUrl}
        tarballUrl={tarballUrl}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
