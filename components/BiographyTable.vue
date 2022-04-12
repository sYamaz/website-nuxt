<template>
    <v-container>
        <section-headline :title="headline" />
        <v-container>
            <v-simple-table>
                <template v-slot:default>
                    <tbody>
                        <tr v-for="item in items" :key="item.name">
                            <td>{{ item.year }}</td>
                            <td>{{ item.text }}</td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </v-container>
    </v-container>
</template>

<script>
import SectionHeadline from './atoms/SectionHeadline.vue'
export default {
    components: { SectionHeadline },
    name: 'BiographyTable',
    data() {
        return {
            headline: "Biography",
            items: [
                {
                    year: "1990",
                    text: "Born in Tokyo, Japan. And moved to Ibaraki."
                },
                {
                    year: "2013",
                    text: "Completed bachelor's degree in Electrical, Electronic and Computer Engineering at Tokyo University of Science."
                },
                {
                    year: "2013",
                    text: "Work as a developer at Orientalmotor co., ltd."
                },
                {
                    year: "2022",
                    text: "Work as a developer at Z-kai inc."
                }
            ]
        }
    }
}
</script>
