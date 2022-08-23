import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core'
import axios from "axios";
import { getActiveLanguage } from 'laravel-vue-i18n';

export const useItemsStore = defineStore('ItemsStore', {
    state: () => ({
        itemsIds: useStorage('itemIds', []),
        items: {},
        collectionLink: useStorage('collectionLink', null),
    }),
    getters: {
        count() {
            return this.itemsIds.length;
        },
        exists: (state) => {
            return (itemId) => state.itemsIds.includes(itemId)
        },
    },
    actions: {
        async get(itemId) {
            if (Object.keys(this.items).includes(itemId)) {
                return this.items[itemId]
            } else {
                const response = await axios.get(`/api/items/${itemId}`, {
                    headers: {
                        "X-locale": getActiveLanguage(),
                    },
                });

                const itemData = response.data.data

                this.items[itemId] = itemData
                return itemData
            }        
        },
        add(item) {
            const { id } = item
            if (!this.itemsIds.includes(id)) {
                this.items[id] = item
                this.itemsIds.push(id)
                this.collectionLink = null;
            }
        },
        remove(itemId) {
            this.itemsIds = this.itemsIds.filter((item) => item !== itemId);
            delete this.items[itemId];
            this.collectionLink = null;
        },
        clearItemsFromState() {
            this.items = {}
        },
        removeAll() {
            this.itemsIds = [];
            this.items = {};
            this.collectionLink = null;
        },
        async getCollectionLink() {
            if (this.collectionLink) {
                 return this.collectionLink
              } else {
                 const response = await axios
                 .post('/api/collections', {
                     items: this.items,
                 })
                 .catch((err) => {
                     console.log(err)
                 })
                 const collectionLink = response.data.url
                 this.collectionLink = collectionLink
                 return collectionLink
             }
         }, 
        async fetch(collectionId) {
            this.collectionLink = null;
            this.items = {};
            this.itemsIds = (await axios.get(`/api/collections/${collectionId}`)).data;
        },
    },
});