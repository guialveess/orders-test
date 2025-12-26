# Imagem oficial do Bun
FROM oven/bun:1.1.34

# Diretório de trabalho
WORKDIR /app

# Copia arquivos de dependência primeiro (melhor cache)
COPY package.json ./
COPY bun.lock* ./

# Instala dependências
RUN bun install

# Copia o restante do código
COPY . .

# Porta usada pelo Express
EXPOSE 8080

# Comando padrão
CMD ["bun", "server.ts"]
