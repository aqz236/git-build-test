import {
  Code,
  Download,
  FileArchive,
  Monitor,
  Package,
  Smartphone,
} from "lucide-react";

// 平台图标映射
export const platformIcons = {
  windows: Monitor,
  win: Monitor,
  win32: Monitor,
  win64: Monitor,

  linux: Monitor,
  ubuntu: Monitor,
  debian: Monitor,

  macos: Monitor,
  darwin: Monitor,
  mac: Monitor,
  osx: Monitor,

  android: Smartphone,
  ios: Smartphone,

  // 文件类型
  zip: FileArchive,
  "7z": FileArchive,
  tar: FileArchive,
  "tar.gz": FileArchive,
  rar: FileArchive,

  // 源码
  source: Code,
  "source-code": Code,

  // 默认
  default: Package,
};

// 获取平台图标
export function getPlatformIcon(filename: string) {
  const lowerName = filename.toLowerCase();

  // 检查平台
  for (const [platform, Icon] of Object.entries(platformIcons)) {
    if (lowerName.includes(platform)) {
      return Icon;
    }
  }

  // 检查文件扩展名
  const extension = filename.split(".").pop()?.toLowerCase();
  if (extension && platformIcons[extension as keyof typeof platformIcons]) {
    return platformIcons[extension as keyof typeof platformIcons];
  }

  return platformIcons.default;
}

// 获取平台颜色
export function getPlatformColor(filename: string): string {
  const lowerName = filename.toLowerCase();

  if (lowerName.includes("windows") || lowerName.includes("win")) {
    return "text-blue-600";
  }
  if (
    lowerName.includes("linux") ||
    lowerName.includes("ubuntu") ||
    lowerName.includes("debian")
  ) {
    return "text-orange-600";
  }
  if (
    lowerName.includes("macos") ||
    lowerName.includes("darwin") ||
    lowerName.includes("mac")
  ) {
    return "text-gray-600";
  }
  if (lowerName.includes("android")) {
    return "text-green-600";
  }
  if (lowerName.includes("ios")) {
    return "text-blue-500";
  }
  if (lowerName.includes("source")) {
    return "text-purple-600";
  }

  return "text-gray-500";
}

interface DownloadButtonProps {
  url: string;
  filename: string;
  downloadCount?: number;
  size?: number;
}

export function DownloadButton({
  url,
  filename,
  downloadCount,
  size,
}: DownloadButtonProps) {
  const Icon = getPlatformIcon(filename);
  const colorClass = getPlatformColor(filename);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <a
      href={url}
      download={filename}
      className="inline-flex items-center gap-2 px-3 py-2 text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors group"
      title={`下载 ${filename}${size ? ` (${formatSize(size)})` : ""}`}
    >
      <Icon className={`w-4 h-4 ${colorClass}`} />
      <span className="font-medium truncate max-w-24" title={filename}>
        {filename.length > 20 ? filename.substring(0, 20) + "..." : filename}
      </span>
      {downloadCount !== undefined && (
        <span className="text-gray-500 text-xs">{downloadCount}</span>
      )}
      <Download className="w-3 h-3 text-gray-400 group-hover:text-gray-600" />
    </a>
  );
}
