const PageLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center w-screen min-h-screen z-100 bg-black/40 backdrop-blur-md">
      <div
        className="w-16 h-16 border-4 rounded-full border-white/20 border-t-white animate-spin"
      />
    </div>
  )
}

export default PageLoader