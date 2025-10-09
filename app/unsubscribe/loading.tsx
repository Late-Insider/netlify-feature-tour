export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-50 dark:bg-zinc-900 rounded-lg shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Processing...</h1>
        <p className="text-gray-700 dark:text-zinc-300">Please wait while we process your request.</p>
      </div>
    </div>
  )
}
