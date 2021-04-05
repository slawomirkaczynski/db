import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import axios from "axios";
// prettier-ignore
@Module({ namespaced: true })
class Posts extends VuexModule {
    _posts: Record<string, unknown>[] = []
    _post: Record<string, unknown> = {}

    get posts() {
        return this._posts
    }

    get post() {
        return this._post
    }

    @Mutation
    setSinglePost(post: Record<string, unknown>) {
        this._post = post
    }

    @Mutation
    resetSinglePost() {
        this._post = {}
    }

    @Mutation
    loadData(data: Record<string, unknown>[]) {
        this._posts = data
    }
    @Mutation
    removeItem(id: number) {
        const newState = this._posts.filter(post => post.id !== id)
        this._posts = newState
    }
    @Mutation
    addItem(item: Record<string, unknown>) {
        this._posts.push(item)
    }
    @Mutation
    saveStyles(item: Record<string, unknown>) {
        const editedPost = this._posts.find(post => post.id === item.id)
        if (editedPost) {
            editedPost.savedStyle = item.style
        }
    }

    @Action
    async fetchData() {
        await axios
            .get("http://localhost:3000/posts")
            .then(response => {
                this.context.commit('loadData', response.data)
            })
            .catch(error => {
                console.log(error)
            })
    }

    @Action
    removePost(id: number) {
        axios.delete(`http://localhost:3000/posts/${id}`)
        this.context.commit('removeItem', id)
    }
    @Action
    addPost(post: string) {
        axios.post(`http://localhost:3000/posts/`, {
            id: Math.floor(Math.random() * 101),
            content: post
        })
        this.context.commit('addItem', {
            id: Math.floor(Math.random() * 101),
            content: post
        })
    }
    @Action
    updatePost(data: Record<string, unknown>) {
        axios.put(`http://localhost:3000/posts/${data.id}`, { content: data.post })
    }
    @Action
    setStyles(data: Record<string, unknown>) {
        if (data) {
            this.context.commit('saveStyles', {
                id: Number(data.id),
                style: data.value
            })
        }
    }
    @Action
    getPost(id: number) {
        const post = this._posts.find(item => item.id === id)
        this.context.commit('setSinglePost', post)
    }
    @Action
    resetPost() {
        this.context.commit('resetSinglePost')
    }
}
export default Posts;
