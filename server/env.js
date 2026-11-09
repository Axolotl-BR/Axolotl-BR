// Carrega o .env local, se existir (dev). Na ShardCloud as variáveis vêm do
// painel e o .env nem sobe (.shardignore). Node sem loadEnvFile: ignora.
try {
  process.loadEnvFile()
} catch {
  /* sem .env ou Node antigo — segue com o ambiente do processo */
}
