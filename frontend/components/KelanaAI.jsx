import { CompassIcon } from 'lucide-react'

const KelanaAI = () => (
    <div className="mb-8 relative w-24 h-24">
        <div className="absolute inset-0 bg-linear-to-tr from-accent to-blue-500 rounded-full blur-2xl opacity-60 animate-pulse" />
        <div className="relative w-full h-full bg-linear-to-tr from-accent to-blue-400 rounded-full shadow-[inset_0_-10px_20px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden">
            <div className="absolute top-2 right-4 w-6 h-6 bg-white/40 rounded-full blur-sm" />
            <CompassIcon className='size-10 text-white relative z-10' />
        </div>
    </div>
)

export default KelanaAI