export const ERROR_MESSAGES = {
  USER_CREATE_ERROR: 'Não foi possível criar o usuário {}.',
  USER_SELECT_FIND_ALL_ERROR: 'Ocorreu um erro ao consultar todos os usuarios.',
  USER_LOGIN_ALREADY_EXISTS_ERROR: 'Login de usuário {} já cadastrado!',
  USER_FIND_BY_ID_ERROR: 'Erro ao buscar usuário com id {}',
  USER_FIND_BY_LOGIN_ERROR: 'Erro ao buscar usuário com login {}',
  USER_UPDATE_ERROR: 'Não foi possível atualizar o usuário {}.',
  USER_FIND_BY_LOGIN_ERROR_OCCURRED:
    'Ocorreu um erro ao buscar usuário com login {}',
  USER_VALIDATION_LOGIN_ERROR:
    'O login informado não possui um formato válido! Não é permitido espaços em branco, letras maiúscula, números, acentos ou pontos! E conter entre 6 e 20 caracteres.',
  USER_VALIDATION_PASSWORD_ERROR:
    'A senha informada não possui um formato válido! Deve conter ao menos, 1 letra maiúscula, 1 letra minúscula, 1 número, 1 caractere especial! E conter entre 8 e 20 caracteres.',
  USER_FIND_BY_ID_ERROR_OCCURRED:
    'Ocorreu um erro rro ao buscar o usuário com id {}',
  USER_PROFILES_NOT_FOUND:
    'Nenhum perfil esta sendo informado. Insira ao menos um perfil!',
  USER_PROFILE_NOT_NUMBER:
    'O(s) valor(s) {} do campo perfil deve(m) ser do tipo inteiro!',
  USER_ACTION_NOT_NUMBER:
    'O(s) valor(s) {} do campo ação deve(m) ser do tipo inteiro!',
  USER_CHANGE_PASSWORD_ERROR:
    'Não foi possível atualizar a senha do usuário com id {}.',
  USER_OLD_PASSWORD_ERROR: 'Sua antiga senha não confere.',
  IS_NOT_EQUALS_OLD_PASSWORD_AND_NEW_PASSWORD:
    'A nova senha deve ser diferente da senha antiga!',
  IS_NOT_EQUALS_NEW_PASSWORD_AND_CONFIRM_NEW_PASSWORD:
    'Os campos nova senha e confirmar nova senha não conferem!',
  USER_TOKEN_NOT_EQUALS_TO_PARAM_URL: 'Usuário logado não possui permissão',
};

export const SUCCESS_MESSAGES = {
  GET_SUCCESS: 'Resposta retornada com sucesso.',
  USER_CREATE_SUCCESS: 'Usuário criado com sucesso!',
  USER_UPDATE_SUCCESS: 'Usuário atualizado com sucesso!',
  CHANGE_PASSWORD_SUCCESS: 'Senha atualizada com sucesso',
};
