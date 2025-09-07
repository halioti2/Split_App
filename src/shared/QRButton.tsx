import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

export default function QRButton({ url, label }: { url: string; label?: string }) {
  const [open, setOpen] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  useEffect(() => {
    if (open && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, { width: 220 })
    }
  }, [open, url])
  return (
    <>
      <button onClick={() => setOpen(o => !o)}>{label ?? 'Show QR'}</button>
      {open && (
        <div className="card" role="dialog" aria-label="QR code">
          <div className="stack" style={{ alignItems: 'center' }}>
            <canvas ref={canvasRef} width={220} height={220} />
            <div className="muted" style={{ wordBreak: 'break-all' }}>{url}</div>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  )
}

