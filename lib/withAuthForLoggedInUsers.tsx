// lib/withAuthHOC.js
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

import { ComponentType } from 'react';

export function withAuthForLoggedInUsers(Component: ComponentType) {
    interface AuthenticatedComponentProps {
        [key: string]: any;
    }

    return function AuthenticatedComponent(props: AuthenticatedComponentProps) {
        const router = useRouter();

        useEffect(() => {
            const token = Cookies.get('token');

            // إعادة توجيه إذا لم يكن هناك كعكة
            if (token) {
                router.replace('/');
            }
        }, []);

        // عرض المكون فقط إذا كانت الكعكة موجودة
        return <Component {...props} />;
    };
}
