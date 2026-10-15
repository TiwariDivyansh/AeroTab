/**
 * AeroTab Tasks & Sticky Notes Widget
 */

const TasksWidget = {
  tasks: [],
  listEl: null,
  addBtn: null,
  formEl: null,
  inputEl: null,

  init: async function() {
    this.listEl = document.getElementById('tasks-list');
    this.addBtn = document.getElementById('add-task-btn');
    this.formEl = document.getElementById('add-task-form');
    this.inputEl = document.getElementById('new-task-input');

    if (!this.listEl) return;

    this.tasks = await AeroStorage.get('tasks') || [];
    this.render();

    if (this.addBtn) {
      this.addBtn.addEventListener('click', () => {
        const isHidden = this.formEl.style.display === 'none';
        this.formEl.style.display = isHidden ? 'block' : 'none';
        if (isHidden) {
          this.inputEl.focus();
        }
      });
    }

    if (this.inputEl) {
      this.inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.addTask();
        } else if (e.key === 'Escape') {
          this.formEl.style.display = 'none';
        }
      });
    }
  },

  addTask: async function() {
    const text = this.inputEl.value.trim();
    if (!text) return;

    if (this.tasks.length >= 20) {
      alert('Task limit reached (max 20 tasks).');
      return;
    }

    const newTask = {
      id: AeroUtils.generateId('task'),
      text: text,
      done: false,
      createdAt: Date.now()
    };

    this.tasks.unshift(newTask);
    this.inputEl.value = '';
    this.formEl.style.display = 'none';
    await AeroStorage.set('tasks', this.tasks);
    this.render();
  },

  toggleTask: async function(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;
    task.done = !task.done;
    await AeroStorage.set('tasks', this.tasks);
    this.render();
  },

  deleteTask: async function(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    await AeroStorage.set('tasks', this.tasks);
    this.render();
  },

  render: function() {
    if (!this.listEl) return;
    this.listEl.innerHTML = '';

    if (this.tasks.length === 0) {
      this.listEl.innerHTML = '<li class="tasks-empty">No active tasks. Tap + to add one.</li>';
      return;
    }

    this.tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task-item';

      const check = document.createElement('div');
      check.className = `task-checkbox ${task.done ? 'checked' : ''}`;
      check.addEventListener('click', () => this.toggleTask(task.id));

      const text = document.createElement('span');
      text.className = `task-text ${task.done ? 'done' : ''}`;
      text.textContent = task.text;

      const del = document.createElement('button');
      del.className = 'task-delete-btn';
      del.innerHTML = '×';
      del.title = 'Delete task';
      del.addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteTask(task.id);
      });

      li.appendChild(check);
      li.appendChild(text);
      li.appendChild(del);
      this.listEl.appendChild(li);
    });
  }
};

window.TasksWidget = TasksWidget;
