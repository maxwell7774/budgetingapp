'use client';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/client';

export default function ProfilePage() {
    return (
        <div>
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
