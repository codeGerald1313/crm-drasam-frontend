<script setup>
import { computed, ref } from 'vue';
import Emojis from './emojis-data.json';

const { showEmoji } = defineProps(['showEmoji']);
const emits = defineEmits(['emoji_value','close-emoji']);

const searchTerm = ref('');
const EmojiData = computed(() => Emojis.Categorias);

const filteredEmojis = computed(() => {
  const term = searchTerm.value.toLowerCase().trim();
  if (!term) {
    return EmojiData.value.flatMap((category) =>
      category.Emojis.map((emojiObj) => emojiObj.emoji)
    );
  } else {
    return EmojiData.value.flatMap((category) =>
      category.Emojis
        .filter((emojiObj) =>
          emojiObj.nombre.toLowerCase().includes(term)
        )
        .map((emojiObj) => emojiObj.emoji)
    );
  }
});

const closeEmoji = () => {
    emits('close-emoji');
}

const handleEmojiClick = (emoji) => {
  emits('emoji_value', emoji);
};

const handleSearchInput = (e) => {
  searchTerm.value = e.target.value;
}
</script>


<template>
  <div class="emoji_picker" v-if="showEmoji">
    <div class="nk-chat-aside-search p-2">
      <div class="form-group">
        <div class="form-control-wrap">
          <div class="form-icon form-icon-left">
            <em class="icon ni ni-search"></em>
          </div>
          <input
            type="text"
            class="form-control form-round"
            id="default-03"
            placeholder="Buscar emoji"
            v-model="searchTerm"
            @input="handleSearchInput"
          />
        </div>
      </div>
    </div>

    <div class="picker_container">
      <div class="category" v-for="category in EmojiData" :key="category.Nombre">
        <span>{{ category.Nombre }}</span>
        <div class="emojis_container">
          <button
            @click="handleEmojiClick(emoji)"
            v-for="(emoji, index) in filteredEmojis"
            :key="`emoji_${index}`"
          >
            {{ emoji }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.emoji_picker
{
	position: relative;
	display: flex;
	flex-direction: column;
	width: 20rem;
	height: 20rem;
	max-width: 100%;
}

.emoji_picker,
.bottom_arrow
{
	box-shadow: 0 0 5px 1px rgba(0, 0, 0, .0975);
}

.emoji_picker,
.picker_container
{
	border-radius: 0.5rem;
	background: white;
}

.picker_container
{
	position: relative;
	padding: 1rem;
	overflow: auto;
	z-index: 1;
}

.category
{
	display: flex;
	flex-direction: column;
	margin-bottom: 1rem;
	color: rgb(169, 169, 169);
}

.emojis_container
{
	display: flex;
	flex-wrap: wrap;
}

.category button
{
	margin: 0.5rem;
	margin-left: 0;
	background: inherit;
	border: none;
	font-size: 1.75rem;
	padding: 0;
}

.bottom_arrow
{
	position: absolute;
	left: 50%;
	bottom: 0;
	width: 0.75rem;
	height: 0.75rem;
	transform: translate(-50%, 50%) rotate(45deg);
	background: white;
}

</style>