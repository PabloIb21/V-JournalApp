import { createStore } from 'vuex'
import journal from '@/modules/daybook/store/journal'
import { journalState } from '../../../../mock-data/test-journal-state'

import authApi from '@/api/authApi'

const createVuexStore = ( initialState ) => createStore({
    modules: {
        journal: {
            ...journal,
            state: { ...initialState }
        }
    }
})

describe('Vuex - Pruebas en el Journal Module', () => {
    
    beforeAll(async() => {

        const { data } = await authApi.post(':signInWithPassword', {
            email: 'test@test.com',
            password: '123456',
            returnSecureToken: true
        })

        localStorage.setItem('idToken', data.idToken )

    })

    // Básicas
    test('este es el estado inicial, debe tener este state', () => {
        
        const store = createVuexStore( journalState )
        const { isLoading, entries } = store.state.journal

        expect( isLoading ).toBeFalsy()
        expect( entries ).toEqual( journalState.entries )

    })

    // Mutations
    test('mutation: setEntries', () => {
        
        const store = createVuexStore({ isLoading: true, entries: [] })
        
        store.commit('journal/setEntries', journalState.entries )

        expect( store.state.journal.entries.length ).toBe(2)
        expect( store.state.journal.isLoading ).toBeFalsy()

    })

    test('mutation: updateEntry', () => {
        
        const store = createVuexStore( journalState )

        const updatedEntry = {
            id: '-MiZLbRRKajYkIeNz5ad',
            date: 1630549989527,
            text: 'New setup'
        }

        store.commit('journal/updateEntry', updatedEntry)

        const storeEntries = store.state.journal.entries

        expect( storeEntries.length ).toBe(2)
        expect( 
            storeEntries.find( e => e.id === updatedEntry.id )
        ).toEqual( updatedEntry )

    })

    test('mutation: createEntry deleteEntry ', () => {
        
        const store = createVuexStore( journalState )

        const newEntry = { id: 'PAB123', text: 'Hello World' }
        
        store.commit('journal/createEntry', newEntry)
        
        const storeEntries = store.state.journal.entries

        expect( storeEntries.length ).toBe(3)
        expect( storeEntries.find( e => e.id === newEntry.id ) ).toBeTruthy()

        store.commit('journal/deleteEntry', newEntry.id)
        
        expect( store.state.journal.entries.length ).toBe(2)
        expect( store.state.journal.entries.find( e => e.id === newEntry.id ) ).toBeFalsy()

    })

    // Getters
    test('getters: getEntriesByTerm getEntryById', () => {
        
        const store = createVuexStore( journalState )

        const [ entry1, entry2 ] = journalState.entries

        expect( store.getters['journal/getEntriesByTerm']('').length ).toBe(2)
        expect( store.getters['journal/getEntriesByTerm']('dev').length ).toBe(1)
        expect( store.getters['journal/getEntriesByTerm']('dev') ).toEqual( [ entry2 ] )

        expect( store.getters['journal/getEntryById']('-MiZLbRRKajYkIeNz5ad') ).toEqual( entry1 )

    })

    // Actions
    test('actions: loadEntries', async() => {
        
        const store = createVuexStore({ isLoading: true, entries: [] })

        await store.dispatch('journal/loadEntries')

        expect( store.state.journal.entries.length ).toBe(2)

    })

    test('actions: updateEntry', async() => {
        
        const store = createVuexStore( journalState )

        const updatedEntry = {
            id: '-MiZLbRRKajYkIeNz5ad',
            date: 1630549989527,
            text: 'Nueva setup',
            otroCampo: true,
            otroMas: { a: 1 }
        }

        await store.dispatch('journal/updateEntry', updatedEntry )
        
        expect( store.state.journal.entries.length ).toBe(2)
        expect(
            store.state.journal.entries.find( e => e.id === updatedEntry.id )
        ).toEqual({
            id: '-MiZLbRRKajYkIeNz5ad',
            date: 1630549989527,
            text: 'Nueva setup'
        })

    })

    test('actions: createEntry deleteEntry', async() => {
        
        const store = createVuexStore( journalState )

        const newEntry = {
            date: 1630287613030,
            text: 'Nueva entrada desde pruebas'
        }

        const id = await store.dispatch('journal/createEntry', newEntry)

        expect( typeof id ).toBe('string')
        expect( store.state.journal.entries.find( e => e.id === id ) ).toBeTruthy()

        await store.dispatch('journal/deleteEntry', id)

        expect( store.state.journal.entries.find( e => e.id === id ) ).toBeFalsy()
    
    })

})