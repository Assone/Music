import { Module } from 'vuex';
import { SET_AUDIO_TRACKS, SET_MV_TRACKS, SET_VIDEO_TRACKS } from '../type';

const model: Module<StoreStateMedia, StoreStateRoot> = {
  namespaced: true,
  state: {
    tracks: [],
    play: false,
    currentIndex: 0,
  },
  getters: {
    currentTrack(state) {
      return state.tracks[state.currentIndex];
    },
  },
  mutations: {
    [SET_VIDEO_TRACKS](state, ids: number[]) {
      state.tracks = ids.map((id) => ({ id, type: 'video' }));
    },
    [SET_AUDIO_TRACKS](state, ids: number[]) {
      state.tracks = ids.map((id) => ({ id, type: 'audio' }));
    },
    [SET_MV_TRACKS](state, ids: number[]) {
      state.tracks = ids.map((id) => ({ id, type: 'mv' }));
    },
  },
};

export default model;
