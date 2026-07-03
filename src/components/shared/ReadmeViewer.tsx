'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, Loader2, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { SectionHeader } from './SectionHeader';
import ReactMarkdown from 'react-markdown';

export function ReadmeViewer({ githubUsername }: { githubUsername: string }) {
  const [readme, setReadme] = useState<string | null>(null);
  const [repoName, setRepoName] = useState<string | null>(null);
  const [repoUrl, setRepoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    api.getReadme(githubUsername)
      .then((data) => {
        setReadme(data.readme);
        setRepoName(data.repoName);
        setRepoUrl(data.repoUrl || `https://github.com/${githubUsername}/${data.repoName}`);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [githubUsername]);

  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5">
        <SectionHeader>README Preview</SectionHeader>
        <div className="mt-3 space-y-3">
          <Skeleton className="h-5 w-1/3 rounded bg-white/5" />
          <Skeleton className="h-3 w-full rounded bg-white/5" />
          <Skeleton className="h-3 w-5/6 rounded bg-white/5" />
          <Skeleton className="h-3 w-4/6 rounded bg-white/5" />
        </div>
      </div>
    );
  }

  if (!readme) return null;

  const lines = readme.split('\n');
  const previewLines = lines.slice(0, 30);
  const displayReadme = expanded ? readme : previewLines.join('\n');
  const isTruncated = lines.length > 30 && !expanded;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <SectionHeader>README Preview</SectionHeader>
        {repoName && (
          <a
            href={repoUrl || `https://github.com/${githubUsername}/${repoName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-green-400 transition-colors"
          >
            <BookOpen className="size-3" />
            {repoName}
            <ExternalLink className="size-2.5" />
          </a>
        )}
      </div>

      <div className="mt-1 overflow-hidden rounded-xl bg-white/[0.02] border border-white/5 p-4 sm:p-5">
        {/* Markdown content with custom styling */}
        <div className="prose-custom text-sm">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-xl font-bold text-white mb-3 pb-2 border-b border-white/10">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-lg font-semibold text-white mt-5 mb-2">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-base font-semibold text-gray-200 mt-4 mb-2">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="text-gray-400 leading-relaxed mb-3">{children}</p>
              ),
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 underline decoration-green-400/30 hover:decoration-green-400 transition-colors">
                  {children}
                </a>
              ),
              code: ({ className, children }) => {
                const isInline = !className;
                if (isInline) {
                  return <code className="text-green-400/80 bg-green-500/10 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>;
                }
                return (
                  <pre className="bg-white/[0.03] border border-white/5 rounded-lg p-4 overflow-x-auto my-3">
                    <code className="text-xs font-mono text-gray-300">{children}</code>
                  </pre>
                );
              },
              pre: ({ children }) => <>{children}</>,
              ul: ({ children }) => <ul className="list-disc list-inside text-gray-400 space-y-1 mb-3 ml-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside text-gray-400 space-y-1 mb-3 ml-2">{children}</ol>,
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-green-500/30 pl-4 my-3 text-gray-500 italic">{children}</blockquote>
              ),
              hr: () => <hr className="border-white/10 my-4" />,
              strong: ({ children }) => <strong className="font-semibold text-gray-200">{children}</strong>,
              em: ({ children }) => <em className="italic text-gray-300">{children}</em>,
              img: ({ src, alt }) => (
                <img src={src} alt={alt || ''} className="max-w-full rounded-lg my-3 border border-white/5" />
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-3">
                  <table className="w-full text-sm">{children}</table>
                </div>
              ),
              th: ({ children }) => (
                <th className="text-left p-2 bg-white/5 text-gray-300 font-medium border border-white/5">{children}</th>
              ),
              td: ({ children }) => (
                <td className="p-2 text-gray-400 border border-white/5">{children}</td>
              ),
            }}
          >
            {displayReadme}
          </ReactMarkdown>
        </div>

        {isTruncated && (
          <div className="relative mt-2">
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/[0.02] to-transparent pointer-events-none" />
          </div>
        )}
      </div>

      {isTruncated && (
        <Button
          variant="ghost"
          onClick={() => setExpanded(true)}
          className="w-full mt-3 text-xs text-gray-400 hover:text-green-400 h-8"
        >
          <FileText className="size-3 mr-1.5" />
          Read full README
        </Button>
      )}
    </motion.div>
  );
}