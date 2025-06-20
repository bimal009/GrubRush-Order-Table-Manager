import { Loader2 } from 'lucide-react'
import React from 'react'

const Loader = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-background/80 backdrop-blur-sm">
                    <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                </div>
  )
}

export default Loader