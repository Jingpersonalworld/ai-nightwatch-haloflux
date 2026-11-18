import React, { useEffect, useState } from 'react';
import { Check, Copy, Download, PackageOpen, X } from 'lucide-react';

const ICON = { size: 15, strokeWidth: 1.75, 'aria-hidden': true } as const;

interface BridgeModalProps {
  open: boolean;
  onClose: () => void;
}

export const BridgeModal: React.FC<BridgeModalProps> = ({ open, onClose }) => {
  const [tab, setTab] = useState<'py' | 'html' | 'guide'>('guide');
  const [pyCode, setPyCode] = useState<string>('Loading scripts/web_bridge.py...');
  const [htmlCode, setHtmlCode] = useState<string>('Loading docs/haloflux/nightwatch-halo.html...');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    fetch('/api/bridge-files')
      .then((r) => r.json())
      .then((d) => {
        if (d.web_bridge_py) setPyCode(d.web_bridge_py);
        if (d.nightwatch_halo_html) setHtmlCode(d.nightwatch_halo_html);
      })
      .catch(() => {});
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownload = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadProjectZip = async () => {
    try {
      const res = await fetch('/api/download-project.zip');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'nightwatch-haloflux-v2.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      const a = document.createElement('a');
      a.href = '/api/download-project.zip';
      a.download = 'nightwatch-haloflux-v2.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="nm-overlay" role="dialog" aria-modal="true" aria-label="部署与源码导出">
      <div className="nm-modal">
        <div className="nm-modal__head">
          <div className="nm-modal__bar">
            <h3 className="nm-modal__title">
              NIGHTWATCH × HALOFLUX // 零侵入部署包与源码导出
            </h3>
            <button type="button" onClick={onClose} className="pill" aria-label="关闭导出窗口">
              <X {...ICON} />
              关闭
            </button>
          </div>
          <div className="nm-modal__toolbar">
            <button type="button" onClick={handleDownloadProjectZip} className="pill nm-primary">
              <Download {...ICON} />
              一键下载完整工程 (.zip)
            </button>
            <div className="nm-tabs">
              <button
                type="button"
                onClick={() => setTab('guide')}
                className={`pill ${tab === 'guide' ? 'on' : ''}`}
                aria-pressed={tab === 'guide'}
              >
                部署指南
              </button>
              <button
                type="button"
                onClick={() => setTab('py')}
                className={`pill ${tab === 'py' ? 'on' : ''}`}
                aria-pressed={tab === 'py'}
              >
                scripts/web_bridge.py
              </button>
              <button
                type="button"
                onClick={() => setTab('html')}
                className={`pill ${tab === 'html' ? 'on' : ''}`}
                aria-pressed={tab === 'html'}
              >
                nightwatch-halo.html
              </button>
            </div>
          </div>
        </div>

        <div className="nm-modal__body">
          {tab === 'guide' && (
            <div className="nm-stack">
              <div className="nm-card nm-feature">
                <div className="nm-feature__text">
                  <h4 className="nm-section-title nm-section-title--blue">
                    <span className="nm-chip nm-chip--blue">
                      <PackageOpen {...ICON} />
                    </span>
                    一键打包下载完整项目到本地电脑 (nightwatch-haloflux-v2.zip)
                  </h4>
                  <p>
                    包含最新「对称双球 V2 + 双方血量与具体操作框」与保留的「经典八栏 V1」全套 React/Express 源码及 Python 桥接脚本。解压后执行 <code>npm install &amp;&amp; npm run dev</code> 即可在本地运行。
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadProjectZip}
                  className="pill nm-primary"
                >
                  <Download {...ICON} />
                  立即下载 nightwatch-haloflux-v2.zip
                </button>
              </div>

              <div className="nm-well">
                <h4 className="nm-section-title">
                  1. 架构亮点：零侵入 SQLite WAL 只读轮询 + 实时 SSE
                </h4>
                <p>
                  无需改动 Nightwatch <code>daemon</code> 或 <code>battle --tui</code> 核心代码。
                  <code>scripts/web_bridge.py</code> 以只读 URI 模式（<code>?mode=ro</code>）每 0.35s 轮询{' '}
                  <code>data/nightwatch.db</code> 的 <code>events</code> 与 <code>bans</code> 表，通过{' '}
                  <code>/events</code> SSE 实时推送给前端，并提供严格校验 IPv4 的{' '}
                  <code>POST /api/unban</code> 与 <code>POST /api/sim</code>。
                </p>
              </div>

              <div className="nm-grid-2">
                <div className="nm-well">
                  <h4 className="nm-section-title">
                    玩法一：Windows / 本机直接双击离线演习
                  </h4>
                  <p className="nm-muted" style={{ marginBottom: 8 }}>
                    保存 <code>docs/haloflux/nightwatch-halo.html</code> 后直接用浏览器打开：
                  </p>
                  <ul className="nm-list">
                    <li>自动进入 <code>DEMO REPLAY</code> 模式，每 4.2s 循环演示完整攻防剧本</li>
                    <li>支持右上角 6 个手动战术演习按钮 + 快捷键 C / M / S / H / F</li>
                  </ul>
                  <button
                    type="button"
                    onClick={() =>
                      handleDownload('nightwatch-halo.html', htmlCode, 'text/html;charset=utf-8')
                    }
                    className="pill nm-primary"
                    style={{ marginTop: 12 }}
                  >
                    <Download {...ICON} />
                    下载 nightwatch-halo.html
                  </button>
                </div>

                <div className="nm-well">
                  <h4 className="nm-section-title">
                    玩法二：Ubuntu 24.04 实机联动 Kali 攻防演示
                  </h4>
                  <pre className="nm-code nm-code--wrap">
{`# 1. 在守夜人宿主机启动只读 SSE 桥接
cd ~/nightwatch
.venv/bin/python scripts/web_bridge.py --host 127.0.0.1 --port 8765

# 2. 本机 SSH 端口转发安全访问
ssh -L 8765:127.0.0.1:8765 user@192.0.2.10`}
                  </pre>
                  <button
                    type="button"
                    onClick={() =>
                      handleDownload('web_bridge.py', pyCode, 'text/x-python;charset=utf-8')
                    }
                    className="pill nm-primary"
                    style={{ marginTop: 12 }}
                  >
                    <Download {...ICON} />
                    下载 scripts/web_bridge.py
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === 'py' && (
            <div>
              <div className="nm-filebar">
                <span className="nm-filebar__path">
                  文件路径：<code>scripts/web_bridge.py</code>（Python 3.12 零第三方依赖）
                </span>
                <div className="nm-filebar__btns">
                  <button type="button" onClick={() => handleCopy(pyCode)} className="pill">
                    {copied ? <Check {...ICON} /> : <Copy {...ICON} />}
                    {copied ? '已复制' : '复制代码'}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleDownload('web_bridge.py', pyCode, 'text/x-python;charset=utf-8')
                    }
                    className="pill nm-primary"
                  >
                    <Download {...ICON} />
                    下载 .py
                  </button>
                </div>
              </div>
              <pre className="nm-code nm-code--file">{pyCode}</pre>
            </div>
          )}

          {tab === 'html' && (
            <div>
              <div className="nm-filebar">
                <span className="nm-filebar__path">
                  文件路径：<code>docs/haloflux/nightwatch-halo.html</code>（完整单文件前端）
                </span>
                <div className="nm-filebar__btns">
                  <button type="button" onClick={() => handleCopy(htmlCode)} className="pill">
                    {copied ? <Check {...ICON} /> : <Copy {...ICON} />}
                    {copied ? '已复制' : '复制代码'}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleDownload('nightwatch-halo.html', htmlCode, 'text/html;charset=utf-8')
                    }
                    className="pill nm-primary"
                  >
                    <Download {...ICON} />
                    下载 .html
                  </button>
                </div>
              </div>
              <pre className="nm-code nm-code--file">{htmlCode}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
