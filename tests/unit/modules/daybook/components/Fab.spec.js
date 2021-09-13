import { shallowMount } from '@vue/test-utils'
import Fab from '@/modules/daybook/components/Fab'

describe('Pruebas en el Fab Component', () => {
    
    test('debe de mostrar el icono por defecto', () => {
        
        const wrapper = shallowMount( Fab )

        expect(wrapper.find('i').classes('fa-plus')).toBeTruthy()
        

    })

    test('debe de mostrar el icono por argumento: fa-circle', () => {
        
        const wrapper = shallowMount( Fab, {
            props: {
                icon: 'fa-circle'
            }
        })

        expect(wrapper.find('i').classes('fa-circle')).toBeTruthy()

    })

    test('debe de emitir el evento on:click cuando se hace click', () => {
        
        const wrapper = shallowMount( Fab )

        wrapper.find('button').trigger('click')

        expect( wrapper.emitted('on:click') ).toHaveLength(1)

    })

})