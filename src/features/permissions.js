const canAccessAddCourse = (userRole = '') => {
  return ['instructor', 'admin'].includes(userRole);
};

const canAccessManageUsers = (userRole = '') => {
  return ['admin'].includes(userRole);
};

export {
  canAccessAddCourse,
  canAccessManageUsers,
};
