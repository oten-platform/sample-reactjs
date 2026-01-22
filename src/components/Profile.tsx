import { useAuth } from "../hooks/use-auth";

const Profile = () => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div className="loading-text">Loading profile...</div>;
    }

    if (!isAuthenticated || !user) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <img
                src={user.profile.picture || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='110' height='110' viewBox='0 0 110 110'%3E%3Ccircle cx='55' cy='55' r='55' fill='%23667eea'/%3E%3Cpath d='M55 50c8.28 0 15-6.72 15-15s-6.72-15-15-15-15 6.72-15 15 6.72 15 15 15zm0 7.5c-10 0-30 5.02-30 15v3.75c0 2.07 1.68 3.75 3.75 3.75h52.5c2.07 0 3.75-1.68 3.75-3.75V72.5c0-9.98-20-15-30-15z' fill='%23fff'/%3E%3C/svg%3E"}
                alt={user.profile.name || 'User'}
                className="profile-picture"
                style={{ objectFit: 'cover' }}
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='110' height='110' viewBox='0 0 110 110'%3E%3Ccircle cx='55' cy='55' r='55' fill='%23667eea'/%3E%3Cpath d='M55 50c8.28 0 15-6.72 15-15s-6.72-15-15-15-15 6.72-15 15 6.72 15 15 15zm0 7.5c-10 0-30 5.02-30 15v3.75c0 2.07 1.68 3.75 3.75 3.75h52.5c2.07 0 3.75-1.68 3.75-3.75V72.5c0-9.98-20-15-30-15z' fill='%23fff'/%3E%3C/svg%3E";
                }}
            />
            <div style={{ textAlign: 'center' }}>
                <div className="profile-name">
                    {user.profile.name}
                </div>
                <div className="profile-email">
                    {user.profile.email}
                </div>
            </div>
        </div>
    );
};

export default Profile;