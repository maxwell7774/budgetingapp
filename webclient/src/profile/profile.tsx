import { useAuth, useLogout } from "../components/AuthProvider.tsx";
import Button from "../components/ui/Button.tsx";

function Profile() {
  const { user } = useAuth();
  const logout = useLogout();

  return (
    <div>
      <p>{user.id}</p>
      <p>{user.firstName}</p>
      <p>{user.lastName}</p>
      <p>{user.email}</p>
      <p>{user.createdAt.toUTCString()}</p>
      <p>{user.updatedAt.toUTCString()}</p>
      <div>
        <Button onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  );
}

export default Profile;
