export default function Card({ children, className = '', hover = false }) {
    return (
        <div
            className={`
        bg-white rounded-lg shadow-soft border border-secondary-200
        ${hover ? 'hover:shadow-medium transition-shadow duration-200' : ''}
        ${className}
      `}
        >
            {children}
        </div>
    );
}
