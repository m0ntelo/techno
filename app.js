const vm = new Vue({
    el: "#app",
    data: {
        produtos: [],
        produto: false,
        carrinho: [],
        mensagemAlerta: "Item adicionado",
        alertaAtivo: false,
        carrinhoAtivo: false
        // carrinhoTotal: 0,
    },
    filters : {
        numeroPreco(valor){
            return valor.toLocaleString("pt-BR", {style : "currency", currency: "BRL" })
        }
    },
    computed : {
        carrinhoTotal() {
            let total = 0;
            if(this.carrinho.length) {
                this.carrinho.forEach(item => {
                    total += item.preco;
                })
            }
            return total;
        }
    },
    methods: {
        fetchProdutos() {
            fetch("./api/produtos.json")
                .then(r => r.json())
                .then(r => {
                    this.produtos = r;
            })
        },
        fetchProduto(id) {
            fetch(`./api/produtos/${id}/dados.json`)
            .then(r => r.json())
            .then(r => {
                this.produto = r;
            })
        },
        fecharModal({target, currentTarget}) {
            if (target === currentTarget) this.produto = false;
        },
        clickForaCarrinho({target, currentTarget}) {
            if (target === currentTarget) this.carrinhoAtivo = false;
        },
        abrirModal(id) {
            this.fetchProduto(id);
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })
        },
        adicionarItem() {
            this.produto.estoque--;
            const {id, nome, preco} = this.produto;
            this.carrinho.push({id, nome, preco});
            this.alerta(`${nome} adicionado ao carrinho.`);
        },
        removerItem(index) {
            this.carrinho.splice(index, 1)
        },
        checarLocalStorage() {
            if(window.localStorage.carrinho) {
                this.carrinho = JSON.parse(window.localStorage.carrinho);
            }
        },
        compararEstoque(){
            const items = this.carrinho.filter(({id}) => id === this.produto.id)
            this.produto.estoque = this.produto.estoque - items.length;
        },
        alerta(mensagem) {
            this.mensagemAlerta = mensagem;
            this.alertaAtivo = true;
            setTimeout(() => {
                this.alertaAtivo = false;
            }, 1500)
        },
        router() {
            const hash = document.location.hash;
            if(hash) {
                this.fetchProduto(hash.replace("#", ""));
            }
        }
    },
    watch: {
        produto() {
            document.title = this.produto.nome || "Techno";
            const hash = this.produto.id || "";
            history.pushState(null, null, `#${hash}`); 
            if(this.produto){
                this.compararEstoque();
            }
        },
        carrinho() {
            window.localStorage.carrinho = JSON.stringify(this.carrinho);
        }
    },
    created() {
        this.router();
        this.fetchProdutos();
        this.checarLocalStorage();
    }
})