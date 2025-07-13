import { faDownload, faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { AssetsModal } from "./AssetsModal";

interface Asset {
  id: number;
  name: string;
  browser_download_url: string;
  download_count: number;
  size: number;
}

interface AssetsButtonProps {
  assets: Asset[];
  title: string;
}

export function AssetsButton({ assets, title }: AssetsButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (assets.length === 0) {
    return (
      <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
        无构建产物
      </span>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
      >
        <FontAwesomeIcon icon={faFolder} className="w-4 h-4" />
        <span>{assets.length} 个构建产物</span>
        <FontAwesomeIcon icon={faDownload} className="w-3 h-3" />
      </button>

      <AssetsModal
        assets={assets}
        title={`${title} - 构建产物`}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
