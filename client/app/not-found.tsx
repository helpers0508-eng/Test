export default function NotFound() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Page not found</p>
        <a href="/" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
          Go Home
        </a>
      </div>
    </div>
  )
}