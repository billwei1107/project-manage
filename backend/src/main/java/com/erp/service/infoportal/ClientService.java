package com.erp.service.infoportal;

import com.erp.entity.infoportal.Client;
import com.erp.entity.infoportal.Directory;
import com.erp.repository.infoportal.ClientRepository;
import com.erp.repository.infoportal.DirectoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class ClientService {

    private final ClientRepository clientRepository;
    private final DirectoryRepository directoryRepository;

    public List<Client> getAllClients() {
        return clientRepository.findAllByOrderByNameAsc();
    }

    @Transactional
    public Client createClient(Client client) {
        Client savedClient = clientRepository.save(client);

        // Auto-create root directory for the new client
        Directory rootDir = Directory.builder()
                .client(savedClient)
                .parent(null)
                .name(savedClient.getName() + " - 根目錄")
                .build();
        directoryRepository.save(rootDir);

        return savedClient;
    }

    public Client getClient(String id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found: " + id));
    }

    @Transactional
    public Client updateClient(String id, Client updateData) {
        Client client = getClient(id);
        client.setName(updateData.getName());
        client.setContactPerson(updateData.getContactPerson());
        client.setPhone(updateData.getPhone());
        client.setEmail(updateData.getEmail());
        client.setAddress(updateData.getAddress());
        client.setNotes(updateData.getNotes());
        return clientRepository.save(client);
    }
}
