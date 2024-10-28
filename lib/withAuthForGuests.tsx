import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { ComponentType } from 'react';

export function withAuthForGuests<T extends object>(Component: ComponentType<T>) {
    return function AuthenticatedComponent(props: T) {
        const router = useRouter();
        const [loading, setLoading] = useState(true); // حالة لتحميل المكون

        useEffect(() => {
            if (typeof window !== 'undefined') {
                const token = Cookies.get('token');

                // إعادة توجيه إذا لم يكن هناك كعكة
                if (!token) {
                    router.replace('/login');
                } else {
                    setLoading(false); // تغيير حالة التحميل بعد التحقق من الكعكة
                }
            }
        }, [router]);

        // عرض مكون التحميل أثناء التحقق
        if (loading) {
            return <div>Loading...</div>; // يمكنك استخدام مكون تحميل خاص
        }

        // عرض المكون فقط إذا كانت الكعكة موجودة
        return <Component {...props} />;
    };
}