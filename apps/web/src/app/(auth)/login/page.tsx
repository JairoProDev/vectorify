'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api/client';
import { useWorkspaceStore } from '@/lib/store/use-workspace-store';

export default function LoginPage() {
    const router = useRouter();
    const setUser = useWorkspaceStore((state) => state.setUser);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await apiClient.post<{ access_token: string; user: any }>('/auth/login', formData);

            // Save token
            localStorage.setItem('access_token', res.access_token);

            // Update store
            setUser(res.user);

            // Redirect
            router.push('/workspace');
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
                <p className="text-zinc-500 dark:text-zinc-400">
                    Enter your credentials to access your workspace
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        placeholder="name@example.com"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>

                {error && (
                    <div className="text-sm text-red-500 font-medium text-center">
                        {error}
                    </div>
                )}

                <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
            </form>

            <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                Don&apos;t have an account?{' '}
                <Link
                    href="/register"
                    className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                    Sign up
                </Link>
            </div>
        </div>
    );
}
