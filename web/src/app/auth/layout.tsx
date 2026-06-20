export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center bg-muted/30 py-8 md:py-12 pb-32 md:pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-3xl" />

            <div className="w-full max-w-md space-y-8 relative z-10">
                {children}
            </div>
        </div>
    )
}
