'use client';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/client';
import Image from 'next/image';

export default function ProfilePage() {
    const { data: session } = authClient.useSession();
    return (
        <div>
            {session && (
                <>
                    <p>{session.user.name}</p>
                    <p>{session.user.email}</p>
                    <p>{session.user.image}</p>
                    <img
                        src={session.user.image ?? ''}
                        alt="Profile photo"
                        width={100}
                        height={100}
                    />
                </>
            )}
            <Button
                onClick={async () =>
                    await authClient.signOut({
                        fetchOptions: {
                            onSuccess: () => {
                                window.location.reload();
                            },
                        },
                    })
                }
            >
                Sign Out
            </Button>
        </div>
    );
}
