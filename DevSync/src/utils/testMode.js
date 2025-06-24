// Helper function to get test data
export const getTestData = () => {
  const data = localStorage.getItem('testModeData');
  return data ? JSON.parse(data) : null;
};

// Helper function to update test data
export const updateTestData = (newData) => {
  localStorage.setItem('testModeData', JSON.stringify(newData));
};

// Mock API responses for test mode
export const handleTestModeAPI = (url, method, data) => {
  const testData = getTestData();
  if (!testData) return null;

  // GET requests
  if (method === 'GET') {
    if (url.includes('/projects')) {
      if (url.includes('/tasks')) {
        const projectId = url.split('/projects/')[1].split('/tasks')[0];
        const project = testData.projects.find(p => p.id === projectId);
        return { data: project ? project.tasks : [] };
      }
      if (url.includes('/messages')) {
        const projectId = url.split('/projects/')[1].split('/messages')[0];
        const project = testData.projects.find(p => p.id === projectId);
        return { data: project ? project.messages : [] };
      }
      return { data: testData.projects };
    }
    if (url.includes('/notifications')) {
      return { data: testData.notifications };
    }
  }

  // POST requests
  if (method === 'POST') {
    if (url.includes('/projects')) {
      if (url.includes('/tasks')) {
        const projectId = url.split('/projects/')[1].split('/tasks')[0];
        const project = testData.projects.find(p => p.id === projectId);
        if (project) {
          const newTask = {
            id: `task-${Date.now()}`,
            ...data,
            status: 'New',
            assignedTo: 'test-user'
          };
          project.tasks.push(newTask);
          updateTestData(testData);
          return { data: newTask };
        }
      }
      if (url.includes('/messages')) {
        const projectId = url.split('/projects/')[1].split('/messages')[0];
        const project = testData.projects.find(p => p.id === projectId);
        if (project) {
          const newMessage = {
            id: `msg-${Date.now()}`,
            text: data.text,
            sender: 'test-user',
            timestamp: new Date().toISOString()
          };
          project.messages.push(newMessage);
          updateTestData(testData);
          return { data: newMessage };
        }
      }
      // Create new project
      const newProject = {
        id: `project-${Date.now()}`,
        ...data,
        createdBy: 'test-user',
        members: ['test-user'],
        tasks: [],
        messages: []
      };
      testData.projects.push(newProject);
      updateTestData(testData);
      return { data: newProject };
    }
  }

  // PUT requests
  if (method === 'PUT') {
    if (url.includes('/tasks')) {
      const projectId = url.split('/projects/')[1].split('/tasks')[0];
      const taskId = url.split('/tasks/')[1];
      const project = testData.projects.find(p => p.id === projectId);
      if (project) {
        const taskIndex = project.tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          project.tasks[taskIndex] = { ...project.tasks[taskIndex], ...data };
          updateTestData(testData);
          return { data: project.tasks[taskIndex] };
        }
      }
    }
  }

  // DELETE requests
  if (method === 'DELETE') {
    if (url.includes('/tasks')) {
      const projectId = url.split('/projects/')[1].split('/tasks')[0];
      const taskId = url.split('/tasks/')[1];
      const project = testData.projects.find(p => p.id === projectId);
      if (project) {
        project.tasks = project.tasks.filter(t => t.id !== taskId);
        updateTestData(testData);
        return { data: { success: true } };
      }
    }
  }

  return null;
}; 