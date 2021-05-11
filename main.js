//VUEX STORE
const state = {
  notes: [
    {
      note: 'Doubleclick to edit !',
      timestamp: new Date().toLocaleString(),
      edit: true,
    },
  ],
};

const getters = {
  getNotes() {
    return state.notes;
  },
  getNoteCount() {
    return state.notes.length;
  },
};

const mutations = {
  STORE_NOTE(state, payload) {
    state.notes.push(payload);
  },
  DELETE_NOTE(state, index) {
    state.notes.splice(index, 1);
  },
  EDIT_NOTE(state, index) {
    state.notes[index].edit = false;
  },
  SUBMIT_EDIT_NOTE(state, eNote) {
    state.notes[eNote.index].note = eNote.payload;
    state.notes[eNote.index].edit = true;
  },
};

const actions = {
  storeNote(context, payload) {
    context.commit('STORE_NOTE', payload);
  },
  deleteNote(context, index) {
    context.commit('DELETE_NOTE', index);
  },
  editNote(context, index) {
    context.commit('EDIT_NOTE', index);
  },
  submitEditNote(context, eNote) {
    context.commit('SUBMIT_EDIT_NOTE', eNote);
  },
};

//mit ES6 schreibweise
const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
});

//ohne ES6 schreibweise
/*
const store = new Vuex.Store({
  state:state,
  getters:getters,
  mutations:mutations,
  actions:actions
});
*/
//VUEX STORE ENDE

//const EventBus = new Vue();
const NoteCountComponent = {
  template: `
        <div> Anzahl der Notizen: <strong>{{ noteCount }}</strong></div>
    `,
  computed: {
    noteCount() {
      return this.$store.getters.getNoteCount; //vuex getter aufruf
    },
  },
};

const InputComponent = {
  template: ` <input type="text" class="form-control" :placeholder="placeholder" v-model='note'  @keyup.enter="submitNote()">`,
  props: ['placeholder'],
  data() {
    return {
      note: '',
    };
  },
  computed: {
    noteCount() {
      return this.$store.getters.getNotes; //vuex getter aufruf
    },
  },
  methods: {
    //vuex aufruf
    submitNote() {
      const newNote = {
        note: this.note,
        timestamp: new Date().toLocaleString(),
        edit: true,
      };
      this.$store.dispatch('storeNote', newNote); //vuex action function aufrufen
      this.note = '';
    },
  },
};

new Vue({
  el: '#app',
  store, //VUEX STORE EINBINDEN
  components: {
    'input-component': InputComponent,
    'note-count-component': NoteCountComponent,
  },
  data: {
    placeholder: 'gib eine neue Notiz ein',
    isNotDblClicked: 1,
    etitedNote: '',
    editPlaceholder: 'test',
  },
  computed: {
    notes() {
      return this.$store.getters.getNotes;
    },
  },
  methods: {
    delteNote(index) {
      this.$store.dispatch('deleteNote', index);
    },
    storeNote(event) {
      this.notes.push(event.note);
      this.timestamps.push(event.timestamp);
    },
    editNote(index) {
      this.$store.getters.getNotes.map((notes) => {
        notes.edit = true;
      });

      this.editPlaceholder = this.$store.getters.getNotes[index].note;
      this.$store.dispatch('editNote', index);
    },
    submitEditNote(index) {
      const eNote = {
        payload: this.etitedNote,
        index,
      };

      if (!eNote.payload) {
        eNote.payload = this.editPlaceholder;
      }

      this.$store.dispatch('submitEditNote', eNote);
      this.etitedNote = '';
    },
  },
  /*created() {
    EventBus.$on('new-note', (event) => this.storeNote(event));
  },*/
});
