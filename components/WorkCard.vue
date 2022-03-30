<template>
    <v-card>
        <v-card-title>{{ work.name }}</v-card-title>
        <v-card-media>
            <v-img v-bind:src="work.img"></v-img>
        </v-card-media>
        <v-card-text>{{ work.text }}</v-card-text>
        <v-card-subtitle>Platform: {{ work.platform.join(", ") }}</v-card-subtitle>
        <v-card-subtitle>Status: {{ work.status }}</v-card-subtitle>
        <v-divider></v-divider>
        <v-card-actions>
            <v-btn elevation="0" v-if="work.url != ''" :to="work.url">
                <span class="info--text">{{ work.buttonName }}</span>
            </v-btn>
            <v-btn elevation="0" v-if="work.outerurl != ''" :href="work.outerurl">
                <span class="info--text">{{ work.buttonName }}</span>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    name: "WorkCard",
    props: {
        work: Object
    }
}
</script>