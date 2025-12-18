export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side - Hero/Branding */}
            <div className="hidden lg:flex flex-col justify-between bg-zinc-900 text-white p-12 relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold tracking-tight">Vectorify.</h1>
                    <p className="mt-2 text-zinc-400">Bring your business ideas to life.</p>
                </div>

                <div className="relative z-10">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;Vectorify transforms the chaos of a startup idea into a structured, actionable plan in minutes.&rdquo;
                        </p>
                        <footer className="text-sm text-zinc-400">The Team</footer>
                    </blockquote>
                </div>

                {/* Abstract shapes bg */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-purple-900/50" />
            </div>

            {/* Right Side - Form */}
            <div className="flex items-center justify-center p-8 bg-white dark:bg-zinc-950">
                <div className="w-full max-w-md space-y-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
