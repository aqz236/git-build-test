import { Eye, FileText, X } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

interface MarkdownViewerProps {
  content: string;
  title: string;
  trigger?: React.ReactNode;
}

export function MarkdownViewer({
  content,
  title,
  trigger,
}: MarkdownViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // ESC键关闭模态框
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
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
  }, [isOpen]);

  if (!content || content.trim() === "") {
    return null;
  }

  const defaultTrigger = (
    <button
      onClick={() => setIsOpen(true)}
      className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
      title="查看详情"
    >
      <Eye className="w-3 h-3" />
      详情
    </button>
  );

  return (
    <>
      {trigger ? (
        <div onClick={() => setIsOpen(true)} className="cursor-pointer">
          {trigger}
        </div>
      ) : (
        defaultTrigger
      )}

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[80vh] w-full flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 头部 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* 内容 */}
            <div className="flex-1 overflow-auto p-6">
              <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-50 prose-pre:border prose-blockquote:border-l-4 prose-blockquote:border-blue-200 prose-blockquote:bg-blue-50 prose-blockquote:pl-4">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  components={{
                    // 自定义链接渲染
                    a: ({ node, ...props }) => (
                      <a
                        {...props}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      />
                    ),
                    // 自定义代码块渲染
                    pre: ({ node, ...props }) => (
                      <pre
                        {...props}
                        className="bg-gray-50 border border-gray-200 rounded-md p-4 overflow-x-auto text-sm"
                      />
                    ),
                    // 自定义表格渲染
                    table: ({ node, ...props }) => (
                      <div className="overflow-x-auto my-4">
                        <table
                          {...props}
                          className="min-w-full border border-gray-200 rounded-md"
                        />
                      </div>
                    ),
                    th: ({ node, ...props }) => (
                      <th
                        {...props}
                        className="bg-gray-50 border-b border-gray-200 px-4 py-2 text-left font-medium text-gray-900"
                      />
                    ),
                    td: ({ node, ...props }) => (
                      <td
                        {...props}
                        className="border-b border-gray-200 px-4 py-2 text-gray-700"
                      />
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </div>

            {/* 底部 */}
            <div className="flex justify-end p-4 border-t border-gray-200">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
