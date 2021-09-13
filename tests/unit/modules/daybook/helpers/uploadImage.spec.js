import cloudinary from 'cloudinary'
import axios from 'axios'

import uploadImage from '@/modules/daybook/helpers/uploadImage'

cloudinary.config({
    cloud_name: process.env.VUE_APP_CLOUD_NAME,
    api_key: process.env.VUE_APP_CLOUD_KEY,
    api_secret: process.env.VUE_APP_CLOUD_SECRET
})

describe('Pruebas en el uploadImage', () => {
    
    test('debe cargar un archivo y retornar el url', async( done ) => {
        
        const { data } = await axios.get('https://res.cloudinary.com/dawrgnzj2/image/upload/v1630712082/tnvihdnrqiegtrs9gutt.jpg', {
            responseType: 'arraybuffer'
        })

        const file = new File([ data ], 'foto.jpg')

        const url = await uploadImage( file )

        expect( typeof url ).toBe('string')

        const segments = url.split('/')
        const imageId = segments[ segments.length - 1 ].replace('.jpg', '')
        cloudinary.v2.api.delete_resources( imageId, {}, () => {
            done()
        })

    })

})