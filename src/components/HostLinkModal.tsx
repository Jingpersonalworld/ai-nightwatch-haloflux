import React, { useEffect, useState } from 'react';
import {
  ArrowLeftRight,
  Check,
  ChevronDown,
  CircleAlert,
  Rocket,
  Shield,
  Swords,
  X,
} from 'lucide-react';
import { RedBlueHostConfig, RedNodeInfo, validateIpv4 } from '../utils/nightwatchEngine';

const ICON = { size: 15, strokeWidth: 1.75, 'aria-hidden': true } as const;

interface HostLinkModalProps {
  open: boolean;
  config: RedBlueHostConfig;
  redNodes: RedNodeInfo[];
  onSaveConfig: (next: RedBlueHostConfig) => void;
  onTriggerCustomStrike: (ip: string, vector: string) => void;
  onClose: () => void;
}

export const HostLinkModal: React.FC<HostLinkModalProps> = ({
  open,
  config,
  redNodes,
  onSaveConfig,
  onTriggerCustomStrike,
  onClose,
}) => {
  const [blueHostName, setBlueHostName] = useState(config.blueHostName);
  const [blueHostIp, setBlueHostIp] = useState(config.blueHostIp);
  const [redHostName, setRedHostName] = useState(config.redHostName);
  const [redPrimaryIp, setRedPrimaryIp] = useState(config.redPrimaryIp);
  const [customVector, setCustomVector] = useState('sqli');
  const [errorMsg, setErrorMsg] = useState('');
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateIpv4(blueHostIp)) {
      setErrorMsg('蓝方防守主机 IP 格式无效（需为合法 IPv4，如 192.0.2.10）');
      return;
    }
    if (!validateIpv4(redPrimaryIp)) {
      setErrorMsg('红方主攻主机 IP 格式无效（需为合法 IPv4，如 198.51.100.23）');
      return;
    }
    setErrorMsg('');
    onSaveConfig({
      blueHostName: blueHostName.trim() || 'BLUE BASTION // UBUNTU',
      blueHostIp: blueHostIp.trim(),
      redHostName: redHostName.trim() || 'RED STRIKE // KALI',
      redPrimaryIp: redPrimaryIp.trim(),
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 1800);
  };

  const handleFireTest = () => {
    if (!validateIpv4(redPrimaryIp)) {
      setErrorMsg('红方主攻主机 IP 格式无效');
      return;
    }
    setErrorMsg('');
    onSaveConfig({
      blueHostName: blueHostName.trim() || 'BLUE BASTION // UBUNTU',
      blueHostIp: blueHostIp.trim(),
      redHostName: redHostName.trim() || 'RED STRIKE // KALI',
      redPrimaryIp: redPrimaryIp.trim(),
    });
    onTriggerCustomStrike(redPrimaryIp.trim(), customVector);
  };

  return (
    <div className="nm-overlay" role="dialog" aria-modal="true" aria-label="红蓝双方电脑接入与阵营配置">
      <div className="nm-modal nm-modal--md">
        <div className="nm-modal__head">
          <div className="nm-modal__bar">
            <h3 className="nm-modal__title">
              <ArrowLeftRight {...ICON} />
              红蓝双阵营电脑接入配置 // RED TEAM vs BLUE TEAM LINK
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="pill"
              aria-label="关闭双方主机接入窗口"
            >
              <X {...ICON} />
              关闭
            </button>
          </div>
        </div>

        <div className="nm-modal__body nm-stack">
          <form onSubmit={handleSave} className="nm-grid-2">
            {/* Blue Team Config */}
            <div className="nm-well">
              <div className="nm-team__head">
                <h4 className="nm-section-title nm-section-title--blue">
                  <span className="nm-chip nm-chip--blue">
                    <Shield {...ICON} />
                  </span>
                  蓝方防守阵营（左环 · Nightwatch 守夜人）
                </h4>
                <span className="nm-badge nm-badge--teal">DEFENSE CORE</span>
              </div>
              <div className="nm-field">
                <label className="nm-label" htmlFor="blue-name-input">
                  蓝方主机代号 / 节点名称
                </label>
                <input
                  id="blue-name-input"
                  type="text"
                  value={blueHostName}
                  onChange={(e) => setBlueHostName(e.target.value)}
                  className="nm-input"
                />
              </div>
              <div className="nm-field">
                <label className="nm-label" htmlFor="blue-ip-input">
                  蓝方防守电脑 IP（Ubuntu 宿主机 / 靶机）
                </label>
                <input
                  id="blue-ip-input"
                  type="text"
                  value={blueHostIp}
                  onChange={(e) => setBlueHostIp(e.target.value)}
                  className="nm-input nm-input--mono nm-input--blue"
                />
              </div>
            </div>

            {/* Red Team Config */}
            <div className="nm-well">
              <div className="nm-team__head">
                <h4 className="nm-section-title nm-section-title--red">
                  <span className="nm-chip nm-chip--red">
                    <Swords {...ICON} />
                  </span>
                  红方攻击阵营（右环 · Kali 渗透主机）
                </h4>
                <span className="nm-badge nm-badge--amber">STRIKE MATRIX</span>
              </div>
              <div className="nm-field">
                <label className="nm-label" htmlFor="red-name-input">
                  红方主机代号 / 节点名称
                </label>
                <input
                  id="red-name-input"
                  type="text"
                  value={redHostName}
                  onChange={(e) => setRedHostName(e.target.value)}
                  className="nm-input"
                />
              </div>
              <div className="nm-field">
                <label className="nm-label" htmlFor="red-ip-input">
                  红方攻击电脑 IP（Kali / 渗透端主 IP）
                </label>
                <input
                  id="red-ip-input"
                  type="text"
                  value={redPrimaryIp}
                  onChange={(e) => setRedPrimaryIp(e.target.value)}
                  className="nm-input nm-input--mono nm-input--red"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="nm-alert nm-span-all" role="alert">
                <CircleAlert {...ICON} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="nm-well nm-span-all nm-actions">
              <button type="submit" className="pill nm-primary">
                {savedToast && <Check {...ICON} />}
                {savedToast ? '已保存双方阵营配置' : '保存双方阵营配置'}
              </button>
              <div className="nm-actions__fire">
                <label htmlFor="custom-vector-select" className="nm-label">
                  以红方主 IP 发射跨屏打击：
                </label>
                <span className="nm-select-wrap">
                  <select
                    id="custom-vector-select"
                    value={customVector}
                    onChange={(e) => setCustomVector(e.target.value)}
                    className="nm-select"
                  >
                    <option value="sqli">SQLi 注入 (ModSec CRS)</option>
                    <option value="syn">SYN Flood 洪泛 (Suricata)</option>
                    <option value="honeypot">/admin 蜜罐诱捕 (Zero-FP)</option>
                    <option value="brute">SSH/Web 暴力破解 ×5</option>
                  </select>
                  <ChevronDown {...ICON} />
                </span>
                <button type="button" onClick={handleFireTest} className="pill nm-danger">
                  <Rocket {...ICON} />
                  立即从该红方 IP 发起齐射
                </button>
              </div>
            </div>
          </form>

          {/* Real Machine Connection Instructions */}
          <div className="nm-well">
            <h4 className="nm-section-title">
              如何将你们两台电脑的真实攻防实时映射到红蓝双环？
            </h4>
            <p style={{ marginBottom: 8 }}>
              1. <strong>自动识别（零配置）</strong>：当蓝方电脑运行{' '}
              <code>scripts/web_bridge.py</code> 并开启顶部 <code>● LIVE SQLITE</code> 时，红方电脑（如{' '}
              <code>{redPrimaryIp}</code>）对蓝方电脑（<code>{blueHostIp}</code>）发起的任何{' '}
              <code>sqlmap</code>、<code>hping3</code>、<code>hydra</code>、<code>nmap</code> 或访问{' '}
              <code>/admin</code>，都会被 Suricata / ModSecurity / 蜜罐写入{' '}
              <code>nightwatch.db</code>，大屏会自动将该来源 IP 挂载到右侧<strong>红方攻击阵列节点</strong>，发射跨屏流光弹道轰向左侧<strong>蓝方守夜人护盾</strong>！
            </p>
            <p>
              2. <strong>红方电脑主动 Webhook 投送（支持远程演练）</strong>：红方电脑也可以直接执行以下{' '}
              <code>curl</code> 命令触发实时跨屏飞跃交火：
            </p>
            <pre className="nm-code" style={{ marginTop: 12 }}>
              <span className="nm-tok-c"># 在红方 Kali 电脑执行（触发针对蓝方靶机的实时跨屏弹道）：</span>
              {'\n'}
              <span className="nm-tok-cmd">curl</span>
              {` `}
              <span className="nm-tok-flag">-X</span>
              {` POST http://${blueHostIp}:8765/api/sim \\\n  `}
              <span className="nm-tok-flag">-H</span>
              {` "Content-Type: application/json" \\\n  `}
              <span className="nm-tok-flag">-d</span>
              {` '{"scenario":"sqli","ip":"${redPrimaryIp}"}'`}
            </pre>
          </div>

          {/* Active Red Nodes Roster */}
          <div className="nm-well">
            <h4 className="nm-section-title">
              当前已捕获的红方攻击源节点列表（右侧红方环挂载点）
            </h4>
            <div className="nm-roster">
              {redNodes.map((rn) => (
                <div key={rn.ip} className="nm-node">
                  <div className="nm-node__id">
                    <span className="nm-node__ip">{rn.ip}</span>
                    <span className="nm-node__tool">{rn.lastTool}</span>
                  </div>
                  <div className="nm-node__meta">
                    <span>打击 {rn.strikes} 次</span>
                    <span className={`nm-status ${rn.locked ? 'nm-status--locked' : 'nm-status--active'}`}>
                      {rn.locked ? 'LOCKED (已封锁)' : 'ACTIVE (交火中)'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
