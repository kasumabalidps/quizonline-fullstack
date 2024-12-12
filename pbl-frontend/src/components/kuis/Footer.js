export default function Footer() {
  return (
    <footer className="bg-white shadow-md mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-gray-600">
          &copy; {new Date().getFullYear()} QuizOnline. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
