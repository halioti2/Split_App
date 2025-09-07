export default function Status({ kind = 'info', children }: { kind?: 'info'|'success'|'error', children: any }) {
  const cls = kind === 'error' ? 'status error card' : kind === 'success' ? 'status success card' : 'status card'
  return <div className={cls} role={kind === 'error' ? 'alert' : 'status'}>{children}</div>
}

