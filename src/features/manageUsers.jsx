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
          {users.map((account) => (
            <div className="user-row" role="row" key={account.id}>
              <div>
                <strong>{account.username}</strong>
                <span>{account.email || 'No email provided'}</span>
              </div>
              <span className="user-role">{account.role}</span>
              <div className="user-actions">
                <button type="button" className="secondary-button" disabled={savingId === account.id || account.role === 'instructor'} onClick={() => promoteUser(account.id, 'instructor')}>Teacher</button>
                <button type="button" className="secondary-button" disabled={savingId === account.id || account.role === 'admin'} onClick={() => promoteUser(account.id, 'admin')}>Admin</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default ManageUsers;
