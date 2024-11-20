export const DropdownButton = ({ children, ...props }) => (
    <button
        className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none transition duration-150 ease-in-out"
        {...props}>
        {children}
    </button>
)
