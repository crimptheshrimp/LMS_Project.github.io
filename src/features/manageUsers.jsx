import { useEffect, useState } from 'react';
import { fetchUsers, updateUserRole } from '../api/api';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch((requestError) => setError(requestError.message || 'Unable to load users.'))
      .finally(() => setLoading(false));
  }, []);

  const promoteUser = async (userId, role) => {
    setSavingId(userId);
    setError('');
    try {
      const updatedUser = await updateUserRole(userId, role);
      setUsers((currentUsers) => currentUsers.map((user) => user.id === userId ? updatedUser : user));
    } catch (requestError) {
      setError(requestError.message || 'Unable to update this user.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <main className="page-wrapper manage-users-wrapper">
      <p className="eyebrow profile-eyebrow">Administration</p>
      <h1>Manage users</h1>
      <p className="profile-intro">Promote students to teacher or admin when appropriate.</p>
      {loading && <p>Loading users...</p>}
      {error && <p className="error" role="alert">{error}</p>}
      {!loading && !error && (
        <div className="user-table" role="table" aria-label="Users">
          {users.map((user) => (
            <div className="user-row" role="row" key={user.id}>
              <div>
                <strong>{user.username}</strong>
                <span>{user.email || 'No email provided'}</span>
              </div>
              <span className="user-role">{user.role}</span>
              <div className="user-actions">
                <button type="button" className="secondary-button" disabled={savingId === user.id || user.role === 'instructor'} onClick={() => promoteUser(user.id, 'instructor')}>Teacher</button>
                <button type="button" className="secondary-button" disabled={savingId === user.id || user.role === 'admin'} onClick={() => promoteUser(user.id, 'admin')}>Admin</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default ManageUsers;
