export function LogoutButton({ onLogout }: { onLogout: () => void | Promise<void> }) {
  return (
    <button
      type="button"
      className="dashboard-logout"
      onClick={() => void onLogout()}
    >
      Log out
    </button>
  );
}
