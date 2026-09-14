import { useEffect, useState } from 'react';
import { fetchProfile, fetchUsers, updateUserAccount } from '../api/api';
import { useAuth } from '../context/AuthContext';

const emptyProfile = {
  username: '',
  email: '',
  mobile_number: '',
  interests: '',
  age: '',
  current_password: '',
  new_password: '',
};

function Profile() {
  const { user, userRole, updateUser } = useAuth();
  const [profile, setProfile] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [resetForms, setResetForms] = useState({});
  const [resetMessage, setResetMessage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchProfile();
        setProfile({
          username: data.username || '',
          email: data.email || '',
          mobile_number: data.mobile_number || '',
          interests: data.interests || '',
          age: data.age ?? '',
          current_password: '',
          new_password: '',
        });
      } catch (requestError) {
        setError(requestError.message || 'Unable to load your profile.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    if (userRole !== 'admin') return;
    fetchUsers().then(setUsers).catch((requestError) => setResetMessage(requestError.message || 'Unable to load users.'));
  }, [userRole]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((currentProfile) => ({ ...currentProfile, [name]: value }));
    setMessage('');
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const payload = {
        username: profile.username,
        email: profile.email,
        mobile_number: profile.mobile_number,
        interests: profile.interests,
        age: profile.age === '' ? null : Number(profile.age),
      };
      if (profile.new_password) {
        payload.current_password = profile.current_password;
        payload.new_password = profile.new_password;
      }
      const updatedProfile = await updateUserAccount(user.id, payload);
      setProfile({
        username: updatedProfile.username || '',
        email: updatedProfile.email || '',
        mobile_number: updatedProfile.mobile_number || '',
        interests: updatedProfile.interests || '',
        age: updatedProfile.age ?? '',
        current_password: '',
        new_password: '',
      });
      updateUser(updatedProfile);
      setMessage('Profile updated successfully.');
    } catch (requestError) {
      setError(requestError.message || 'Unable to update your profile.');
    } finally {
      setSaving(false);
    }
  };

  const updateResetForm = (userId, field, value) => {
    setResetForms((current) => ({ ...current, [userId]: { ...current[userId], [field]: value } }));
    setResetMessage('');
  };

  const resetUserPassword = async (event, account) => {
    event.preventDefault();
    const form = resetForms[account.id] || {};
    setResetMessage('');
    try {
      await updateUserAccount(account.id, { new_password: form.new_password });
      setResetForms((current) => ({ ...current, [account.id]: {} }));
      setResetMessage(`Password reset for ${account.username}.`);
    } catch (requestError) {
      setResetMessage(requestError.message || 'Unable to reset this password.');
    }
  };

  if (loading) {
    return <main className="form-wrapper"><p>Loading your profile...</p></main>;
  }

  return (
    <main className="form-wrapper profile-wrapper">
      <p className="eyebrow profile-eyebrow">Student account</p>
      <h1>Your profile</h1>
      <p className="profile-intro">Keep your personal details up to date. Changing your password requires your current password.</p>
      <form className="user-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="username">Username</label>
          <input id="username" name="username" value={profile.username} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={profile.email} onChange={handleChange} />
        </div>
        <div className="profile-fields">
          <div className="form-group">
            <label className="form-label" htmlFor="mobile_number">Mobile number</label>
            <input id="mobile_number" name="mobile_number" type="tel" value={profile.mobile_number} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="age">Age</label>
            <input id="age" name="age" type="number" min="1" max="130" value={profile.age} onChange={handleChange} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="interests">Interests</label>
          <textarea id="interests" name="interests" rows="4" value={profile.interests} onChange={handleChange} placeholder="Tell us what you enjoy learning" />
        </div>
        <div className="profile-fields">
          <div className="form-group">
            <label className="form-label" htmlFor="current_password">Current password</label>
            <input id="current_password" name="current_password" type="password" value={profile.current_password} onChange={handleChange} autoComplete="current-password" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="new_password">New password</label>
            <input id="new_password" name="new_password" type="password" minLength="8" value={profile.new_password} onChange={handleChange} autoComplete="new-password" placeholder="Leave blank to keep it" />
          </div>
        </div>
        {error && <p className="error" role="alert">{error}</p>}
        {message && <p className="success" role="status">{message}</p>}
        <button className="primary-button" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
      {userRole === 'admin' && (
        <section className="admin-password-section" aria-labelledby="admin-password-heading">
          <h2 id="admin-password-heading">Reset non-admin passwords</h2>
          <p className="profile-intro">You can reset passwords for students and instructors. Other admin accounts are protected.</p>
          {resetMessage && <p className={resetMessage.startsWith('Password reset') ? 'success' : 'error'} role="status">{resetMessage}</p>}
          <div className="user-table">
            {users.filter((account) => account.role !== 'admin').map((account) => {
              const form = resetForms[account.id] || {};
              return (
                <form className="user-row admin-reset-row" key={account.id} onSubmit={(event) => resetUserPassword(event, account)}>
                  <div>
                    <strong>{account.username}</strong>
                    <span>{account.role}</span>
                  </div>
                  <input aria-label={`New password for ${account.username}`} type="password" minLength="8" required value={form.new_password || ''} onChange={(event) => updateResetForm(account.id, 'new_password', event.target.value)} placeholder="New password" />
                  <button type="submit" className="secondary-button">Reset password</button>
                </form>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}

export default Profile;
