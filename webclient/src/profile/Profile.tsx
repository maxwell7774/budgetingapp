import { useAuth } from "../components/AuthProvider.tsx";

function Profile() {
  const { user } = useAuth();

  return (
    <div>
      <p>{user.id}</p>
      <p>{user.firstName}</p>
      <p>{user.lastName}</p>
      <p>{user.email}</p>
      <p>{user.createdAt.toUTCString()}</p>
      <p>{user.updatedAt.toUTCString()}</p>
    </div>
  );
}

export default Profile;
