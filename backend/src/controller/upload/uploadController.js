import {
  createUploadTicket,
  saveLocalUpload,
  KEY_REGEX,
} from '../../helper/imageStorage';

module.exports = {
  // Devolve o ticket para o front postar a imagem direto no bucket
  async createTicket(request, response) {
    try {
      const ticket = await createUploadTicket();
      return response.status(200).json(ticket);
    } catch (e) {
      return response
        .status(500)
        .json({ error: `Erro ao gerar ticket de upload: ${e}` });
    }
  },

  // Apenas desenvolvimento: recebe o arquivo e simula o pipeline do S3
  async receiveLocal(request, response) {
    try {
      if (!request.file) {
        return response.status(400).json({ error: 'Arquivo não enviado' });
      }
      if (!KEY_REGEX.test(request.body.key || '')) {
        return response.status(400).json({ error: 'Chave inválida' });
      }

      await saveLocalUpload(request.body.key, request.file.buffer);
      return response.status(204).send();
    } catch (e) {
      return response
        .status(500)
        .json({ error: `Erro ao salvar upload local: ${e}` });
    }
  },
};
